package com.dainws.games.crm.domain.core;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class GameLifeCycle {

	private Logger logger;

	private Game game;

	private GameLifeCycleStatus status;

	private List<Player> loadingPlayers;

	public GameLifeCycle(Game game) {
		this(game, Player::isAlive);
	}
	
	public GameLifeCycle(Game game, Predicate<Player> loadingFilter) {
		this.logger = System.getLogger("GameLifeCycle");

		this.game = game;
		this.loadingPlayers = game.getPlayers(loadingFilter).toList();

		this.status = GameLifeCycleStatus.CREATED;
		this.game.publishEvent(EventCode.GAME_CREATED);
	}

	public boolean isGame(GameCode gameCode) {
		return this.game.getCode().equals(gameCode);
	}

	public boolean isInStatus(GameLifeCycleStatus status) {
		return this.status.equals(status);
	}

	public boolean restart() {
		if (this.isInStatus(GameLifeCycleStatus.CREATED)) {
			this.startLoading();
			return true;
		}
		
		if (this.isInStatus(GameLifeCycleStatus.LOADING)) {
			return false;
		}

		this.status = GameLifeCycleStatus.IN_PROGRESS;
		this.game.publishEvent(EventCode.GAME_RESTART);
		return true;
	}
	
	public void startLoading() {
		if (!this.isInStatus(GameLifeCycleStatus.CREATED)) {
			throw new IllegalStateException("The match mush be in CREATED state to start Loading process");
		}

		this.status = GameLifeCycleStatus.LOADING;
		this.game.publishEvent(EventCode.GAME_LOADING);
		
		if (this.loadingPlayers.isEmpty()) {
			this.startGame();
		}
	}

	public void loadCompleteFor(PlayerCode code) {
		boolean wasRemoved = this.loadingPlayers.removeIf(player -> player.isCode(code));

		if (wasRemoved) {
			int totalPlayers = this.game.countPlayers();
			int readyPlayers = totalPlayers - this.loadingPlayers.size();
			this.logger.log(Level.DEBUG, "[%s/%s] The player %s is ready", readyPlayers, totalPlayers, code);
		}

		if (this.isInStatus(GameLifeCycleStatus.LOADING) && this.loadingPlayers.isEmpty()) {
			this.startGame();
		}
	}
	
	private void startGame() {
		this.logger.log(Level.DEBUG, "All players in the game %s are ready to start", this.game.getCode());
		this.loadingPlayers.clear();

		this.status = GameLifeCycleStatus.IN_PROGRESS;
		this.game.publishEvent(EventCode.GAME_START);
	}

	public void updateGameProgress() {
		if (!this.isInStatus(GameLifeCycleStatus.IN_PROGRESS)) {
			throw new IllegalStateException("The match mush be in IN_PROGRESS state to update game progress");
		}

		if (this.game.countAlivePlayers() <= 1) {
			this.status = GameLifeCycleStatus.ENDED;
			this.game.stopRunning();
			this.game.publishEvent(EventCode.GAME_END);
		}
	}

	public boolean isGameAlreadyStarted() {
		if (this.isGameAlreadyEnded()) {
			return true;
		}

		return this.isInStatus(GameLifeCycleStatus.IN_PROGRESS);
	}

	public boolean isGameAlreadyEnded() {
		return this.isInStatus(GameLifeCycleStatus.ENDED);
	}
}
