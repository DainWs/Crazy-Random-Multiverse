package com.dainws.games.crm.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
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
import com.dainws.games.crm.exception.PartyNotFoundException;

@Service
public class LoadService {
	private static final int ROUND_BEFORE_START = -1;
	
	private GameService gameService;
	private GameStateManager gameStateManager;
	private List<Game> pendingGames;
	private Map<GameCode, Set<User>> preparedPlayers;
	private Logger logger;

	public LoadService(GameService gameService, GameStateManager gameStateManager) {
		this.gameService = gameService;
		this.gameStateManager = gameStateManager;
		this.pendingGames = new ArrayList<>();
		this.preparedPlayers = new HashMap<>();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void loadGameOfPartyOwner(User partyOwner) {
		Game game = this.gameService.createGameFromPartyOwner(partyOwner);

		this.logger.info("Esperando a que todos los jugadores del juego {} esten listos", game.getCode());
		this.pendingGames.add(game);
		this.preparedPlayers.put(game.getCode(), new HashSet<>());
	}

	public void setUserReady(User user) throws PartyNotFoundException, GameNotFoundException {
		PlayerCode playerCode = this.getPlayerCodeFrom(user);
		Game game = this.getGameWherePlayerCodeIsPresent(playerCode);
	
		Set<User> preparedPlayers = this.preparedPlayers.get(game.getCode());
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
		
		// TODO poco intuitivo?
		game.setRound(ROUND_BEFORE_START);
		gameStateManager.updateGameState(game);
	}
	
	private Game getGameWherePlayerCodeIsPresent(PlayerCode playerCode) throws GameNotFoundException {
		return this.pendingGames.stream()
			.filter(game -> game.hasPlayer(playerCode))
			.findFirst()
			.orElseThrow(GameNotFoundException::new);
	}

	private PlayerCode getPlayerCodeFrom(User user) {
		String uuid = user.getCode().getValue();
		return PlayerCode.from(uuid);
	}
}
