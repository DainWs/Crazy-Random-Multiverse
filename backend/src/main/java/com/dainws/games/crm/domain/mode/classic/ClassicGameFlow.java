package com.dainws.games.crm.domain.mode.classic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.core.CooldownManager;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.TurnManager;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class ClassicGameFlow implements GameFlow {

	private Logger logger;
	private CooldownManager cooldownManager;
	private TurnManager turnManager;

	public ClassicGameFlow() {
		this.logger = LoggerFactory.getLogger(getClass());
		this.cooldownManager = new CooldownManager();
		this.turnManager = new TurnManager();
	}

	@Override
	public void onStartGame(Game game) {
		this.startRound(game, TurnManager.FIRST_ROUND);
		this.startTurn(game, game.getTurn());
	}

	@Override
	public void onEndGame(Game game) {
		PlayerStorage alivePlayers = game.getAlivePlayers();

		EventCode eventCode = EventCode.GAME_END_WITH_TIE;
		EventDetails eventDetails = new EventDetails(game);
		if (!alivePlayers.isEmpty()) {
			eventCode = EventCode.GAME_END_WITH_WINNER;
			eventDetails.setTargetPlayer(alivePlayers.first());
		}

		game.publishEvent(eventCode, eventDetails);
	}

	@Override
	public void onNextTurn(Game game) {
		if (game.isRunning()) {
			Turn nextTurn = this.turnManager.getNextTurn(game);

			if (!nextTurn.equals(game.getTurn())) {
				this.changeTurn(game, nextTurn);
			}
		}
	}

	private void changeTurn(Game game, Turn nextTurn) {
		if (!nextTurn.isRoundEquals(game.getTurn())) {
			this.startRound(game, nextTurn.getRoundNumber());
		}

		this.startTurn(game, nextTurn);
	}

	private void startRound(Game game, int round) {
		this.logger.debug("Starting round {} of game {}", round, game.getCode());
		this.turnManager.startRound(game, round);

		Dealer dealer = game.getDealer();
		dealer.dealCardsToAlivePlayers(game);
	}

	private void startTurn(Game game, Turn turn) {
		this.turnManager.beginTurn(game, turn);
		this.cooldownManager.updatePlayerCooldowns(game, game.getPlayerWithTurn());
		this.turnManager.announceTurn(game);
	}

	@Override
	public void onPrevTurn(Game game) {
		if (game.isRunning()) {
			this.turnManager.prevTurn(game);
		}
	}

	@Override
	public void updateGame(Game game) {
		for (Player player : game.getAlivePlayers()) {
			this.updatePlayer(game, player);
		}
	}

	private void updatePlayer(Game game, Player player) {
		if (this.shouldPlayerDie(game, player)) {
			player.die();

			EventDetails details = new EventDetails(game);
			details.setTargetPlayer(player);
			game.publishEvent(EventCode.PLAYER_DIE, details);
		}
	}

	private boolean shouldPlayerDie(Game game, Player player) {
		if (player.isSpectator()) {
			return false;
		}

		Board board = game.getBoard();
		return !board.isZoneAlive(player.getPlayerCode());
	}
}
