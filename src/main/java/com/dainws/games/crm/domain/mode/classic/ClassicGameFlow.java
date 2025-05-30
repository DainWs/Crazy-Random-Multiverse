package com.dainws.games.crm.domain.mode.classic;

import com.dainws.games.crm.domain.core.CooldownManager;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;
import com.dainws.games.crm.domain.core.TurnManager;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.log.Logger;

public class ClassicGameFlow implements GameFlow {

	private Logger logger;
	private CooldownManager cooldownManager;
	private TurnManager turnManager;

	public ClassicGameFlow() {
		this.logger = Logger.getLogger(getClass());
		this.cooldownManager = new CooldownManager();
		this.turnManager = new TurnManager();
	}

	@Override
	public void onRestartGame(Game game) { // TODO need GameLifeCycle or remove it
	}

	@Override
	public void onStartGame(Game game) {
		this.logger.debug("Dealing cards to player with turn");
		Dealer dealer = game.getDealer();
		dealer.dealCardsToPlayer(game, game.getPlayerWithTurn());
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
			this.cooldownManager.updatePlayerCooldowns(game, game.getPlayerWithTurn());
			this.turnManager.nextTurn(game);

			this.logger.debug("Dealing cards to player with turn");
			Dealer dealer = game.getDealer();
			dealer.dealCardsToPlayer(game, game.getPlayerWithTurn());
		}
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
