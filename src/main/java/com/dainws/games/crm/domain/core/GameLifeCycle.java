package com.dainws.games.crm.domain.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class GameLifeCycle {

	public enum Status {
		NONE, CREATED, LOADING, IN_PROGRESS, ENDED;
	}

	private Logger logger;
	private Map<GameCode, List<Player>> loadingPlayers;

	public GameLifeCycle() {
		this.logger = Logger.getLogger(getClass().getName());
		this.loadingPlayers = new HashMap<>();
	}

	public boolean register(Game game, Predicate<Player> playerLoadingFilter) {
		if (this.loadingPlayers.containsKey(game.getCode())) {
			this.logger.log(Level.WARNING, "That game is already registered");
			return false;
		}

		List<Player> players = new ArrayList<>(game.getPlayers(playerLoadingFilter));
		this.loadingPlayers.put(game.getCode(), players);

		game.setStatus(Status.CREATED);
		game.publishEvent(EventCode.GAME_CREATED);
		return true;
	}

	public boolean restart(Game game) {
		if (game.inStatus(Status.CREATED)) {
			this.startLoading(game);
			return true;
		}

		if (game.inStatus(Status.LOADING)) {
			this.logger.log(Level.WARNING, "You cannot restart a game that is being loaded");
			return false;
		}

		game.reset();
		game.setStatus(Status.IN_PROGRESS);
		game.publishEvent(EventCode.GAME_RESTART);
		return true;
	}

	public boolean startLoading(Game game) {
		if (!game.inStatus(Status.CREATED)) {
			this.logger.log(Level.WARNING, "The game mush be in CREATED state to start Loading process");
			return false;
		}

		this.logger.log(Level.FINE, "Loading game with code {0}", game.getCode());
		this.logger.log(Level.FINE, "Waiting for all players in game {0} to be ready.", game.getCode());
		game.setStatus(Status.LOADING);
		game.publishEvent(EventCode.GAME_LOADING);
		return true;
	}

	public void loadCompleteFor(Game game, PlayerCode code) {
		boolean wasRemoved = this.removePlayerFromLoadingList(game, code);
		int loadingPlayersCount = this.countLoadingPlayersFrom(game);

		if (wasRemoved) {
			int totalPlayers = game.countPlayers();
			int readyPlayers = totalPlayers - loadingPlayersCount;
			String message = "[%s/%s] The player %s is ready".formatted(readyPlayers, totalPlayers, code);
			this.logger.log(Level.FINE, message);
		}

		if (game.inStatus(Status.LOADING) && loadingPlayersCount == 0) {
			this.startGame(game);
		}
	}

	private boolean removePlayerFromLoadingList(Game game, PlayerCode code) {
		List<Player> gameLoadingPlayers = this.getLoadingPlayersOf(game);
		boolean wasRemoved = gameLoadingPlayers.removeIf(player -> player.isCode(code));
		this.setLoadingPlayersOf(game, gameLoadingPlayers);
		return wasRemoved;
	}

	private int countLoadingPlayersFrom(Game game) {
		return this.getLoadingPlayersOf(game).size();
	}

	private void startGame(Game game) {
		this.logger.log(Level.FINE, "All players in the game {0} are ready to start", game.getCode());
		this.loadingPlayers.remove(game.getCode());

		game.setStatus(Status.IN_PROGRESS);
		game.publishEvent(EventCode.GAME_START);
	}

	public void updateGameProgress(Game game) {
		if (game.countAlivePlayers() <= 1) {
			game.stopRunning();
			game.setStatus(Status.ENDED);
			game.publishEvent(EventCode.GAME_END);
		}
	}

	private List<Player> getLoadingPlayersOf(Game game) {
		return this.loadingPlayers.getOrDefault(game.getCode(), new ArrayList<>());
	}

	private void setLoadingPlayersOf(Game game, List<Player> players) {
		this.loadingPlayers.put(game.getCode(), players);
	}
}
