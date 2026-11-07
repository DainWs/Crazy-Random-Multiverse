package com.dainws.games.crm.domain.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Predicate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class GameLifeCycle {

	private static final int MIN_PLAYERS = 2;

	public enum Status {
		NONE, CREATED, LOADING, IN_PROGRESS, ENDED;
	}

	private Logger logger;
	private Map<GameCode, List<Player>> loadingPlayers;

	public GameLifeCycle() {
		this.logger = LoggerFactory.getLogger(getClass());
		this.loadingPlayers = new ConcurrentHashMap<>();
	}

	public boolean register(Game game, Predicate<Player> playerLoadingFilter) {
		List<Player> players = new ArrayList<>(game.getPlayers(playerLoadingFilter));
		if (this.loadingPlayers.putIfAbsent(game.getCode(), players) != null) {
			this.logger.warn("That game is already registered");
			return false;
		}

		game.setStatus(Status.CREATED);
		game.publishEvent(EventCode.GAME_CREATED);
		return true;
	}

	public boolean startLoading(Game game) {
		if (!game.inStatus(Status.CREATED)) {
			this.logger.warn("The game mush be in CREATED state to start Loading process");
			return false;
		}

		this.logger.trace("Loading game with code {}", game.getCode());
		this.logger.trace("Waiting for all players in game {} to be ready.", game.getCode());
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
			this.logger.trace("[{}/{}] The player {} is ready", readyPlayers, totalPlayers, code);
		}

		if (game.inStatus(Status.LOADING) && loadingPlayersCount == 0) {
			this.startGame(game);
		}
	}

	private boolean removePlayerFromLoadingList(Game game, PlayerCode code) {
		List<Player> gameLoadingPlayers = this.loadingPlayers.get(game.getCode());
		return gameLoadingPlayers != null && gameLoadingPlayers.removeIf(player -> player.isCode(code));
	}

	private int countLoadingPlayersFrom(Game game) {
		return this.getLoadingPlayersOf(game).size();
	}

	private void startGame(Game game) {
		this.logger.trace("All players in the game {} are ready to start", game.getCode());
		this.loadingPlayers.remove(game.getCode());

		game.setStatus(Status.IN_PROGRESS);
		game.publishEvent(EventCode.GAME_START);
	}

	public void eliminate(Game game, Player player) {
		if (player.isDeath()) {
			return;
		}

		game.eliminate(player);

		if (game.inStatus(Status.LOADING)) {
			this.continueLoadingWithout(game, player);
		}
	}

	private void continueLoadingWithout(Game game, Player player) {
		this.removePlayerFromLoadingList(game, player.getPlayerCode());

		if (game.countAlivePlayers() < MIN_PLAYERS) {
			this.cancelLoading(game);
		} else if (this.countLoadingPlayersFrom(game) == 0) {
			this.startGame(game);
		}
	}

	private void cancelLoading(Game game) {
		this.logger.info("Cancelling the loading of game {}", game.getCode());
		this.loadingPlayers.remove(game.getCode());

		game.stopRunning();
		game.setStatus(Status.ENDED);
		game.publishEvent(EventCode.GAME_CANCELLED);
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
}
