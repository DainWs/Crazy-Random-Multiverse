package com.dainws.games.crm.domain.mode.classic;

import com.dainws.games.crm.domain.core.GameFlowService;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class ClassicGameFlowService implements GameFlowService<ClassicGame> {

	private TurnManager turnManager;

	public ClassicGameFlowService() {
		this.turnManager = new TurnManager();
	}

	@Override
	public void resetGame(ClassicGame game) {
		PlayerStorage playerStorage = game.getPlayers(Player::isNotSpectator);
		game.setTurn(new Turn(playerStorage));
		game.setBoard(new Board(playerStorage));
	}

	@Override
	public void startGame(ClassicGame game) {
		Dealer dealer = game.getDealer();
		dealer.dealCardsToPlayer(game, game.getPlayerWithTurn());
	}

	@Override
	public void endGame(ClassicGame game) {
		game.stopRunning();

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
	public void nextTurn(ClassicGame game) {
		if (!this.tryEndGame(game)) {
			this.turnManager.nextTurn(game);

			Dealer dealer = game.getDealer();
			dealer.dealCardsToPlayer(game, game.getPlayerWithTurn());
		}
	}

	@Override
	public void prevTurn(ClassicGame game) {
		if (!this.tryEndGame(game)) {
			this.turnManager.prevTurn(game);
		}
	}

	@Override
	public void updateGame(ClassicGame game) {
		for (Player player : game.getAlivePlayers()) {
			this.updatePlayer(game, player);
		}

		this.tryEndGame(game);
	}

	private void updatePlayer(ClassicGame game, Player player) {
		if (this.shouldPlayerDie(game, player)) {
			player.die();

			EventDetails details = new EventDetails(game);
			details.setTargetPlayer(player);
			game.publishEvent(EventCode.PLAYER_DIE, details);
		}
	}

	private boolean shouldPlayerDie(ClassicGame game, Player player) {
		if (player.isSpectator()) {
			return false;
		}

		Board board = game.getBoard();
		return !board.isZoneAlive(player.getPlayerCode());
	}

	private boolean tryEndGame(ClassicGame game) {
		if (game.countAlivePlayers() <= 1) {
			this.endGame(game);
			return true;
		}
		return false;
	}
}
