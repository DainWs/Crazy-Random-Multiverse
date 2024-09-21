package com.dainws.games.crm.services;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameState;
import com.dainws.games.crm.domain.core.GameStateManager;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.exception.GameNotFoundException;

@Service
public class LoadService implements EventTrigger {

	private EventPublisher eventPublisher;
	private GameService gameService;
	private GameStateManager gameStateManager;
	private Map<GameCode, Game> pendingGames;
	private Map<GameCode, Set<User>> preparedPlayers;
	private Logger logger;

	public LoadService(GameService gameService, GameStateManager gameStateManager) {
		this.eventPublisher = EventPublisher.NONE;
		this.gameService = gameService;
		this.gameStateManager = gameStateManager;
		this.pendingGames = new HashMap<>();
		this.preparedPlayers = new HashMap<>();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void loadGameOfPartyOwner(User partyOwner) {
		Game game = this.gameService.createGameFromPartyOwner(partyOwner);
		this.pendingGames.put(game.getCode(), game);
		this.preparedPlayers.put(game.getCode(), new HashSet<>());

		this.publishGameCreatedEvent(game);
		this.logger.info("Esperando a que todos los jugadores del juego {} esten listos", game.getCode());
	}

	public void setUserReady(GameCode gameCode,  User user) throws GameNotFoundException, IllegalAccessException {
		if (!this.pendingGames.containsKey(gameCode)) {
			throw new GameNotFoundException();
		}
		
		Game game = this.pendingGames.get(gameCode);
		if (!game.hasPlayer(this.getPlayerCodeFromUser(user))) {
			throw new IllegalAccessException("Acceso denegado - jugador no encontrado en el juego indicado");
		}
	
		Set<User> preparedPlayers = this.preparedPlayers.get(gameCode);
		preparedPlayers.add(user);

		int numPlayers = game.getPlayers().size();
		int numPreparedPlayers = preparedPlayers.size();
		this.logger.debug("[{}/{}] El jugador {} esta listo", numPreparedPlayers, numPlayers, user.getName());

		if (numPreparedPlayers >= numPlayers) {
			this.startGame(game);
		}
	}
	
	private void startGame(Game game) {
		this.logger.debug("Todos los jugadores del juego {} estan listos para comenzar", game.getCode());
		this.preparedPlayers.remove(game.getCode());

		game.setState(GameState.BEFORE_START);
		this.gameStateManager.next(game);
	}
	
	private void publishGameCreatedEvent(Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		this.eventPublisher.publish(new Event(EventCode.GAME_CREATED, details));
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
	
	private PlayerCode getPlayerCodeFromUser(User user) {
		return PlayerCode.from(user.getCode().getValue());
	}
}
