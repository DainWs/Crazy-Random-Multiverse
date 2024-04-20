package com.dainws.games.crm.services;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.GameStateManager;
import com.dainws.games.cbg.domain.player.PlayerCode;
import com.dainws.games.crm.domain.model.User;
import com.dainws.games.crm.exception.GameNotFoundException;

@Service
public class LoadService {
	
	private GameService gameService;
	private GameStateManager gameStateManager;
	private Map<GameCode, Game> pendingGames;
	private Map<GameCode, Set<User>> preparedPlayers;
	private Logger logger;

	public LoadService(GameService gameService, GameStateManager gameStateManager) {
		this.gameService = gameService;
		this.gameStateManager = gameStateManager;
		this.pendingGames = new HashMap<>();
		this.preparedPlayers = new HashMap<>();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void loadGameOfPartyOwner(User partyOwner) {
		Game game = this.gameService.createGameFromPartyOwner(partyOwner);

		this.logger.info("Esperando a que todos los jugadores del juego {} esten listos", game.getCode());
		this.pendingGames.put(game.getCode(), game);
		this.preparedPlayers.put(game.getCode(), new HashSet<>());
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

		Game.prepareGameToStart(game);
		this.gameStateManager.next(game);
	}
	
	private PlayerCode getPlayerCodeFromUser(User user) {
		return PlayerCode.from(user.getCode().getValue());
	}
}
