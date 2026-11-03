package com.dainws.games.crm.controller.events;

import java.time.Clock;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.persistence.memory.MemoryEventSequence;
import com.dainws.games.crm.services.GameService;
import com.dainws.games.crm.services.UserService;

import io.netty.handler.codec.http.HttpHeaderNames;
import jakarta.annotation.PostConstruct;

@Component
@ConditionalOnProperty(value = "crm.communication.socket-io.enabled", havingValue = "true", matchIfMissing = true)
public class SocketIOConnectionManager {
	private SocketIOServer server;
	private UserService userService;
	private SessionUserResolver sessionUserResolver;

	private GameService gameService;
	private CommunicationClient communicationClient;
	private MemoryEventSequence eventSequence;
	private Clock clock;

	private Logger logger;

	public SocketIOConnectionManager(SocketIOServer server, UserService userService,
			SessionUserResolver sessionUserResolver) {
		this.server = server;
		this.userService = userService;
		this.sessionUserResolver = sessionUserResolver;
		this.clock = Clock.systemUTC();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	@PostConstruct
	public void postConstruct() {
		this.server.addConnectListener(this::onConnected);
		this.server.addDisconnectListener(this::onDisconnected);
	}

	public void onConnected(SocketIOClient client) {
		Optional<User> optionalUser = this.findUserOf(client);
		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			user.bindSocket(String.valueOf(client.getSessionId()));

			this.userService.update(user);
			this.sendStateOf(user, client);
		} else {
			this.logger.warn("Connection {} rejected: it has no registered user", client.getSessionId());
			client.disconnect();
		}
	}

	public void onDisconnected(SocketIOClient client) {
		String socketId = String.valueOf(client.getSessionId());

		this.findUserOf(client) //
				.ifPresent(user -> this.unbindSocketOf(user, socketId));
	}

	private void unbindSocketOf(User user, String socketId) {
		user.unbindSocket(socketId, this.clock.instant());
		this.userService.update(user);
	}

	private Optional<User> findUserOf(SocketIOClient client) {
		String cookieHeader = client.getHandshakeData().getHttpHeaders().get(HttpHeaderNames.COOKIE);

		return this.sessionUserResolver.resolve(cookieHeader) //
				.filter(this.userService::exists) //
				.map(this.userService::get);
	}

	private void sendStateOf(User user, SocketIOClient client) {
		Optional<Game> game = this.gameService.findActiveGameOf(user);
		if (game.isPresent()) {
			this.sendGameState(user, game.get(), client);
		}

		Optional<Party> party = this.userService.findPartyOf(user);
		if (party.isPresent()) {
			this.communicationClient.sendPartyInfo(client, party.get());
		}

		this.communicationClient.sendUserSynced(client);
	}

	private void sendGameState(User user, Game game, SocketIOClient client) {
		Player player = game.getPlayer(user.getCode().toPlayerCode());
		if (player == null) {
			return;
		}

		EventCode eventCode = game.inStatus(Status.LOADING) ? EventCode.GAME_LOADING : EventCode.GAME_SYNC;
		Event event = new Event(eventCode, game);
		event.setSequence(this.eventSequence.current(game.getCode()));
		this.communicationClient.sendEvent(client, player, event);
	}

	@Autowired
	public void setGameService(GameService gameService) {
		this.gameService = gameService;
	}

	@Autowired
	public void setCommunicationClient(CommunicationClient communicationClient) {
		this.communicationClient = communicationClient;
	}

	@Autowired
	public void setEventSequence(MemoryEventSequence eventSequence) {
		this.eventSequence = eventSequence;
	}

	@Autowired
	public void setClock(Clock clock) {
		this.clock = clock;
	}
}
