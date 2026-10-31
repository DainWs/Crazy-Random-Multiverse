package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.session.MapSession;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.Session;

import com.corundumstudio.socketio.HandshakeData;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.AIPlayerBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryEventSequence;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;
import com.dainws.games.crm.services.GameService;
import com.dainws.games.crm.services.PartyService;
import com.dainws.games.crm.services.UserService;

import io.netty.handler.codec.http.DefaultHttpHeaders;
import io.netty.handler.codec.http.HttpHeaderNames;

class SocketIOConnectionManagerTest {

	private static final String HANDSHAKE_URL = "/";
	private static final String UNKNOWN_SESSION = "unknown";

	private MapSessionRepository sessionRepository;
	private MemoryUserRepository userRepository;
	private MemoryPartyRepository partyRepository;
	private MemoryGameRepository gameRepository;
	private MemoryEventSequence eventSequence;
	private RecordingCommunicationClient communicationClient;
	private SocketIOConnectionManager connectionManager;

	private MapSession session;
	private User user;

	@BeforeEach
	void beforeEach() {
		Map<String, Session> sessions = new ConcurrentHashMap<>();
		this.sessionRepository = new MapSessionRepository(sessions);
		this.userRepository = new MemoryUserRepository();
		this.partyRepository = new MemoryPartyRepository();
		this.gameRepository = new MemoryGameRepository();
		this.eventSequence = new MemoryEventSequence();
		this.communicationClient = new RecordingCommunicationClient();

		PartyService partyService = new PartyService(this.partyRepository);
		UserService userService =
				new UserService(this.userRepository, partyService);
		List<GameModeFactory> gameModeFactories = List.of();
		GameService gameService =
				new GameService(null, this.gameRepository, gameModeFactories);
		gameService.setPartyRepository(this.partyRepository);

		SocketIOServer server = mock(SocketIOServer.class);
		SessionUserResolver resolver =
				new SessionUserResolver(this.sessionRepository);
		this.connectionManager =
				new SocketIOConnectionManager(server, userService, resolver);
		this.connectionManager.setGameService(gameService);
		this.connectionManager.setCommunicationClient(this.communicationClient);
		this.connectionManager.setEventSequence(this.eventSequence);

		this.session = this.sessionRepository.createSession();
		this.sessionRepository.save(this.session);
		this.user = new User(this.session.getId(), "Name", UserPlatform.WEB);
	}

	@Test
	void testGivenRegisteredUser_whenConnect_thenSocketIsBoundToTheUser() {
		this.userRepository.save(this.user);
		UUID socketId = UUID.randomUUID();
		SocketIOClient client = this.createClient(socketId);

		this.connectionManager.onConnected(client);

		assertThat(this.user.getSessionId()).isEqualTo(socketId.toString());
	}

	@Test
	void testGivenUnknownSession_whenConnect_thenClientIsDisconnected() {
		String cookie = "SESSION=" + this.encode(UNKNOWN_SESSION);
		SocketIOClient client = this.createClient(UUID.randomUUID(), cookie);

		this.connectionManager.onConnected(client);

		verify(client).disconnect();
	}

	@Test
	void testGivenUnregisteredUser_whenConnect_thenClientIsDisconnected() {
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		verify(client).disconnect();
	}

	@Test
	void testGivenRegisteredUser_whenConnect_thenClientIsNotDisconnected() {
		this.userRepository.save(this.user);
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		verify(client, never()).disconnect();
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenOneEventIsSent() {
		this.createGameInProgressWithTheUser();
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		assertThat(this.communicationClient.getSentEvents()).hasSize(1);
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenTheEventIsGameSync() {
		this.createGameInProgressWithTheUser();
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		SentEvent sentEvent = this.communicationClient.getSentEvents().get(0);
		assertThat(sentEvent.event().getCode()).isEqualTo(EventCode.GAME_SYNC);
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenTheEventIsSentToThePlayerOfTheUser() {
		this.createGameInProgressWithTheUser();
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		SentEvent sentEvent = this.communicationClient.getSentEvents().get(0);
		String playerCode = sentEvent.player().getCode();
		assertThat(playerCode).isEqualTo(this.user.getCode().text());
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenGameSyncCarriesTheCurrentSequence() {
		Game game = this.createGameInProgressWithTheUser();
		this.eventSequence.next(game.getCode());
		this.eventSequence.next(game.getCode());
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		List<SentEvent> sentEvents = this.communicationClient.getSentEvents();
		Event event = sentEvents.get(0).event();
		assertThat(event.getSequence()).isEqualTo(2);
	}

	@Test
	void testGivenUserWithoutGame_whenConnect_thenNothingIsSent() {
		this.userRepository.save(this.user);
		SocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client);

		assertThat(this.communicationClient.getSentEvents()).isEmpty();
	}

	@Test
	void testGivenConnectedUser_whenDisconnect_thenSocketIsUnbound() {
		this.userRepository.save(this.user);
		SocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client);

		this.connectionManager.onDisconnected(client);

		assertThat(this.user.getSessionId()).isNull();
	}

	@Test
	void testGivenConnectedUser_whenDisconnect_thenUserIsKept() {
		this.userRepository.save(this.user);
		SocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client);

		this.connectionManager.onDisconnected(client);

		assertThat(this.userRepository.has(this.user.getCode())).isTrue();
	}

	@Test
	void testGivenUserInParty_whenDisconnect_thenUserStaysInTheParty() {
		this.userRepository.save(this.user);
		Party party = new Party(this.user, GameModes.CLASSIC);
		this.partyRepository.save(party);
		SocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client);

		this.connectionManager.onDisconnected(client);

		assertThat(party.has(this.user)).isTrue();
	}

	@Test
	void testGivenUserReconnected_whenOldSocketDisconnects_thenNewSocketStaysBound() {
		this.userRepository.save(this.user);
		SocketIOClient oldClient = this.createClientOfUser();
		this.connectionManager.onConnected(oldClient);
		UUID newSocketId = UUID.randomUUID();
		SocketIOClient newClient = this.createClient(newSocketId);
		this.connectionManager.onConnected(newClient);

		this.connectionManager.onDisconnected(oldClient);

		assertThat(this.user.getSessionId()).isEqualTo(newSocketId.toString());
	}

	private Game createGameInProgressWithTheUser() {
		this.userRepository.save(this.user);
		Player userPlayer = new UserPlayer(this.user);
		Player aiPlayer = AIPlayerBuilder.basicAIPlayer();
		Game game = new GameBuilder() //
				.withPlayers(userPlayer, aiPlayer) //
				.build();
		GameStatusSetter.setStatus(game, Status.IN_PROGRESS);
		this.gameRepository.save(game);

		Party party = new Party(this.user, GameModes.CLASSIC);
		party.setCurrentGame(game.getCode());
		this.partyRepository.save(party);
		return game;
	}

	private SocketIOClient createClientOfUser() {
		return this.createClient(UUID.randomUUID());
	}

	private SocketIOClient createClient(UUID socketId) {
		return this.createClient(socketId, this.sessionCookie());
	}

	private SocketIOClient createClient(UUID socketId, String cookieHeader) {
		DefaultHttpHeaders headers = new DefaultHttpHeaders();
		headers.add(HttpHeaderNames.COOKIE, cookieHeader);
		Map<String, List<String>> params = Map.of();
		InetSocketAddress address = new InetSocketAddress(0);
		boolean isCrossDomain = false;
		HandshakeData handshake = new HandshakeData(headers, params, address,
				HANDSHAKE_URL, isCrossDomain);

		SocketIOClient client = mock(SocketIOClient.class);
		when(client.getSessionId()).thenReturn(socketId);
		when(client.getHandshakeData()).thenReturn(handshake);
		return client;
	}

	private String sessionCookie() {
		return "SESSION=" + this.encode(this.session.getId());
	}

	private String encode(String sessionId) {
		byte[] bytes = sessionId.getBytes(StandardCharsets.UTF_8);
		return Base64.getEncoder().encodeToString(bytes);
	}
}
