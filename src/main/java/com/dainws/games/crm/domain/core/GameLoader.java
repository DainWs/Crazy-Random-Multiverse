package com.dainws.games.crm.domain.core;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class GameLoader {
	private Logger logger;
	private Map<GameCode, Game> loadingGames;
	private Map<GameCode, List<Player>> waitingForPlayers;
	private GameStateManager gameStateManager;

	public GameLoader() {
		this.logger = System.getLogger("GameLoader");
		this.loadingGames = new HashMap<>();
		this.waitingForPlayers = new HashMap<>();
		this.gameStateManager = new GameStateManager();
	}

	public void load(Game game) {
		GameCode code = game.getCode();
		this.loadingGames.put(code, game);
		this.waitingForPlayers.put(code, game.getPlayers());
		this.logger.log(Level.INFO, "Esperando a que todos los jugadores del juego %s esten listos", game.getCode());
	}

	public void tryMarkPlayerAsReady(GameCode gameCode, PlayerCode playerCode) {
		if (this.loadingGames.containsKey(gameCode)) {
			this.markPlayerAsReady(gameCode, playerCode);
		}
	}
	
	private void markPlayerAsReady(GameCode gameCode, PlayerCode playerCode) {
		this.removePlayerWithCode(gameCode, playerCode);

		if (!this.isWaitingForPlayers(gameCode)) {
			this.startGame(gameCode);
		}
	}

	private void removePlayerWithCode(GameCode gameCode, PlayerCode playerCode) {
		List<Player> players = this.waitingForPlayers.get(gameCode);
		boolean wasRemoved = players.removeIf(player -> player.isCode(playerCode));
		if (wasRemoved) {
			this.showRemainingPlayers(gameCode, playerCode);
		}

		this.waitingForPlayers.put(gameCode, players);
	}

	private void showRemainingPlayers(GameCode gameCode, PlayerCode playerCode) {
		List<Player> players = this.waitingForPlayers.get(gameCode);
		int totalPlayers = this.loadingGames.get(gameCode).getPlayers().size();
		int readyPlayers = totalPlayers - players.size();
		this.logger.log(Level.DEBUG, "[%s/%s] El jugador %s esta listo", readyPlayers, totalPlayers, playerCode);
	}

	private boolean isWaitingForPlayers(GameCode gameCode) {
		return !this.waitingForPlayers.get(gameCode).isEmpty();
	}

	private void startGame(GameCode gameCode) {
		this.logger.log(Level.DEBUG, "Todos los jugadores del juego %s estan listos para comenzar", gameCode);
		
		Game game = this.loadingGames.get(gameCode);
		this.loadingGames.remove(gameCode);
		this.waitingForPlayers.remove(gameCode);

		game.setState(GameState.BEFORE_START);
		this.gameStateManager.next(game);
	}
	
	public void setGameStateManager(GameStateManager gameStateManager) {
		this.gameStateManager = gameStateManager;
	}
}
