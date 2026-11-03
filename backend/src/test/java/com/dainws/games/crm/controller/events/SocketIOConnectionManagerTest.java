package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
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

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.HandshakeData;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.configuration.SessionConfiguration;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
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
	private static final String USER_CODE = "user-1";
	private static final Instant NOW = Instant.parse("2026-01-01T00:00:00Z");
	private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);

	MapSessionRepository sessionRepository;
	MemoryUserRepository userRepository;
	MemoryPartyRepository partyRepository;
	MemoryGameRepository gameRepository;
	MemoryEventSequence eventSequence;
	RecordingCommunicationClient communicationClient;
	SocketIOConnectionManager connectionManager;

	MapSession session;
	User user;

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

		SocketIOServer server = new SocketIOServer(new Configuration());
		SessionUserResolver resolver =
				new SessionUserResolver(this.sessionRepository);
		this.connectionManager =
				new SocketIOConnectionManager(server, userService, resolver);
		this.connectionManager.setGameService(gameService);
		this.connectionManager.setCommunicationClient(this.communicationClient);
		this.connectionManager.setEventSequence(this.eventSequence);
		this.connectionManager.setClock(Clock.fixed(NOW, ZoneOffset.UTC));

		this.session = this.sessionRepository.createSession();
		this.session.setAttribute(SessionConfiguration.USER_CODE_ATTRIBUTE, USER_CODE);
		this.sessionRepository.save(this.session);
		this.user = new User(USER_CODE, "Name", UserPlatform.WEB);
	}

	@Test
	void testGivenRegisteredUser_whenConnect_thenSocketIsBoundToTheUser() {
		this.userRepository.save(this.user);
		UUID socketId = UUID.randomUUID();
		RecordingSocketIOClient client = this.createClient(socketId);

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.user.getSocketIds()).containsExactly(socketId.toString());
	}

	@Test
	void testGivenUserWithASocket_whenConnectAnotherOne_thenBothSocketsAreBound() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient first = this.createClientOfUser();
		RecordingSocketIOClient second = this.createClientOfUser();
		this.connectionManager.onConnected(first.asClient());

		this.connectionManager.onConnected(second.asClient());

		assertThat(this.user.getSocketIds()).hasSize(2);
	}

	@Test
	void testGivenUnknownSession_whenConnect_thenClientIsDisconnected() {
		String cookie = "SESSION=" + this.encode(UNKNOWN_SESSION);
		RecordingSocketIOClient client =
				this.createClient(UUID.randomUUID(), cookie);

		this.connectionManager.onConnected(client.asClient());

		assertThat(client.isDisconnected()).isTrue();
	}

	@Test
	void testGivenUnregisteredUser_whenConnect_thenClientIsDisconnected() {
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(client.isDisconnected()).isTrue();
	}

	@Test
	void testGivenRegisteredUser_whenConnect_thenClientIsNotDisconnected() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(client.isDisconnected()).isFalse();
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenOneEventIsSent() {
		this.createGameInProgressWithTheUser();
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.communicationClient.getSentEvents()).hasSize(1);
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenTheEventIsGameSync() {
		this.createGameInProgressWithTheUser();
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		SentEvent sentEvent = this.communicationClient.getSentEvents().get(0);
		assertThat(sentEvent.event().getCode()).isEqualTo(EventCode.GAME_SYNC);
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenTheEventIsSentToThePlayerOfTheUser() {
		this.createGameInProgressWithTheUser();
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		SentEvent sentEvent = this.communicationClient.getSentEvents().get(0);
		String playerCode = sentEvent.player().getCode();
		assertThat(playerCode).isEqualTo(this.user.getCode().text());
	}

	@Test
	void testGivenUserWithGameInProgress_whenConnect_thenGameSyncCarriesTheCurrentSequence() {
		Game game = this.createGameInProgressWithTheUser();
		this.eventSequence.next(game.getCode());
		this.eventSequence.next(game.getCode());
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		SentEvent sentEvent = this.communicationClient.getSentEvents().get(0);
		assertThat(sentEvent.event().getSequence()).isEqualTo(2);
	}

	@Test
	void testGivenUserWithGameLoading_whenConnect_thenTheEventIsGameLoading() {
		this.createGameWithTheUser(Status.LOADING);
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		SentEvent sentEvent = this.communicationClient.getSentEvents().get(0);
		assertThat(sentEvent.event().getCode()).isEqualTo(EventCode.GAME_LOADING);
	}

	@Test
	void testGivenUserWithoutGameNorParty_whenConnect_thenOnlyUserSyncedIsSent() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.communicationClient.getSentChannels())
				.containsExactly(CommunicationClient.USER_SYNCED_CHANNEL);
	}

	@Test
	void testGivenUserInPartyWithoutGame_whenConnect_thenPartyInfoIsSentBeforeUserSynced() {
		this.userRepository.save(this.user);
		this.partyRepository.save(new Party(this.user, GameModes.CLASSIC));
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.communicationClient.getSentChannels()).containsExactly( //
				CommunicationClient.PARTY_INFO_CHANNEL, //
				CommunicationClient.USER_SYNCED_CHANNEL);
	}

	@Test
	void testGivenUserWithGameAndParty_whenConnect_thenGameThenPartyThenUserSyncedAreSent() {
		this.createGameInProgressWithTheUser();
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.communicationClient.getSentChannels()).containsExactly( //
				CommunicationClient.GAME_EVENT_CHANNEL, //
				CommunicationClient.PARTY_INFO_CHANNEL, //
				CommunicationClient.USER_SYNCED_CHANNEL);
	}

	@Test
	void testGivenUnknownSession_whenConnect_thenNothingIsSent() {
		String cookie = "SESSION=" + this.encode(UNKNOWN_SESSION);
		RecordingSocketIOClient client = this.createClient(UUID.randomUUID(), cookie);

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.communicationClient.getSentChannels()).isEmpty();
	}

	@Test
	void testGivenUserWithoutGame_whenConnect_thenNoGameEventIsSent() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient client = this.createClientOfUser();

		this.connectionManager.onConnected(client.asClient());

		assertThat(this.communicationClient.getSentEvents()).isEmpty();
	}

	@Test
	void testGivenConnectedUser_whenDisconnect_thenSocketIsUnbound() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client.asClient());

		this.connectionManager.onDisconnected(client.asClient());

		assertThat(this.user.getSocketIds()).isEmpty();
	}

	@Test
	void testGivenConnectedUser_whenLastSocketDisconnects_thenGracePeriodStartsNow() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client.asClient());

		this.connectionManager.onDisconnected(client.asClient());

		Instant afterGracePeriod = NOW.plus(GRACE_PERIOD).plusSeconds(1);
		assertThat(this.user.hasBeenWithoutSocketLongerThan(GRACE_PERIOD, afterGracePeriod)).isTrue();
	}

	@Test
	void testGivenConnectedUser_whenDisconnect_thenUserIsKept() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client.asClient());

		this.connectionManager.onDisconnected(client.asClient());

		assertThat(this.userRepository.has(this.user.getCode())).isTrue();
	}

	@Test
	void testGivenUserInParty_whenDisconnect_thenUserStaysInTheParty() {
		this.userRepository.save(this.user);
		Party party = new Party(this.user, GameModes.CLASSIC);
		this.partyRepository.save(party);
		RecordingSocketIOClient client = this.createClientOfUser();
		this.connectionManager.onConnected(client.asClient());

		this.connectionManager.onDisconnected(client.asClient());

		assertThat(party.has(this.user)).isTrue();
	}

	@Test
	void testGivenUserReconnected_whenOldSocketDisconnects_thenNewSocketStaysBound() {
		this.userRepository.save(this.user);
		RecordingSocketIOClient oldClient = this.createClientOfUser();
		this.connectionManager.onConnected(oldClient.asClient());
		UUID newSocketId = UUID.randomUUID();
		RecordingSocketIOClient newClient = this.createClient(newSocketId);
		this.connectionManager.onConnected(newClient.asClient());

		this.connectionManager.onDisconnected(oldClient.asClient());

		assertThat(this.user.getSocketIds()).containsExactly(newSocketId.toString());
	}

	private Game createGameInProgressWithTheUser() {
		return this.createGameWithTheUser(Status.IN_PROGRESS);
	}

	private Game createGameWithTheUser(Status status) {
		this.userRepository.save(this.user);
		Player userPlayer = new UserPlayer(this.user);
		Player rival = new PlayerBuilder().build();
		Game game = new GameBuilder() //
				.withPlayers(userPlayer, rival) //
				.build();
		GameStatusSetter.setStatus(game, status);
		this.gameRepository.save(game);

		Party party = new Party(this.user, GameModes.CLASSIC);
		party.setCurrentGame(game.getCode());
		this.partyRepository.save(party);
		return game;
	}

	private RecordingSocketIOClient createClientOfUser() {
		return this.createClient(UUID.randomUUID());
	}

	private RecordingSocketIOClient createClient(UUID socketId) {
		return this.createClient(socketId, this.sessionCookie());
	}

	private RecordingSocketIOClient createClient(UUID socketId,
			String cookieHeader) {
		DefaultHttpHeaders headers = new DefaultHttpHeaders();
		headers.add(HttpHeaderNames.COOKIE, cookieHeader);
		Map<String, List<String>> params = Map.of();
		InetSocketAddress address = new InetSocketAddress(0);
		boolean isCrossDomain = false;
		HandshakeData handshake = new HandshakeData(headers, params, address,
				HANDSHAKE_URL, isCrossDomain);

		return new RecordingSocketIOClient(socketId, handshake);
	}

	private String sessionCookie() {
		return "SESSION=" + this.encode(this.session.getId());
	}

	private String encode(String sessionId) {
		byte[] bytes = sessionId.getBytes(StandardCharsets.UTF_8);
		return Base64.getEncoder().encodeToString(bytes);
	}
}
