package com.dainws.games.crm.controller.events;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
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

	private Logger logger;

	public SocketIOConnectionManager(SocketIOServer server, UserService userService,
			SessionUserResolver sessionUserResolver) {
		this.server = server;
		this.userService = userService;
		this.sessionUserResolver = sessionUserResolver;
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
			user.setSessionId(String.valueOf(client.getSessionId()));

			this.userService.update(user);
			this.sendGameSyncIfGameInProgress(user);
		} else {
			this.logger.warn("Se rechaza la conexion {} porque no pertenece a un usuario registrado", client.getSessionId());
			client.disconnect();
		}
	}

	public void onDisconnected(SocketIOClient client) {
		String socketId = String.valueOf(client.getSessionId());

		this.findUserOf(client) //
				.filter(user -> socketId.equals(user.getSessionId())) //
				.ifPresent(this::unbindSocketOf);
	}

	private void unbindSocketOf(User user) {
		user.setSessionId(null);
		this.userService.update(user);
	}

	private Optional<User> findUserOf(SocketIOClient client) {
		String cookieHeader = client.getHandshakeData().getHttpHeaders().get(HttpHeaderNames.COOKIE);

		Optional<UserCode> userCode = this.sessionUserResolver.resolve(cookieHeader);
		if (userCode.isEmpty()) {
			return Optional.empty();
		}

		try {
			return Optional.of(this.userService.get(userCode.get()));
		} catch (NotFoundException exception) {
			this.logger.debug("La sesion {} no tiene un usuario registrado", userCode.get(), exception);
			return Optional.empty();
		}
	}

	private void sendGameSyncIfGameInProgress(User user) {
		Optional<Game> game = this.gameService.findGameInProgressOf(user);
		if (game.isPresent()) {
			this.sendGameSync(user, game.get());
		}
	}

	private void sendGameSync(User user, Game game) {
		Player player = game.getPlayer(user.getCode().toPlayerCode());
		if (player == null) {
			return;
		}

		Event event = new Event(EventCode.GAME_SYNC, game);
		event.setSequence(this.eventSequence.current(game.getCode()));
		this.communicationClient.sendEvent(player, event);
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
}
