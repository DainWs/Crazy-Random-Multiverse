package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger.Level;
import java.util.List;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;

@Deprecated
public class PassTurnAction extends PlayerTurnAction {

	private boolean dealToNextPlayer;

	public PassTurnAction() {
		this.dealToNextPlayer = true;
	}

	public PassTurnAction(boolean dealToNextPlayer) {
		this.dealToNextPlayer = dealToNextPlayer;
	}

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.gameEventListener != null && this.actionEventListener != null);

		Game game = context.getGame();

		game.nextTurn();
		this.actionEventListener.onPlayerPassTurnAction(context);

		Player playerWithTurn = game.getPlayerWithTurn();
		this.logger.log(Level.TRACE, "Ahora el turno es para %s", playerWithTurn.getName());
		this.actionEventListener.onPlayerGetTurn(game, playerWithTurn);

		if (this.dealToNextPlayer) { // TODO esto no deberia estar en la accion
			this.dealToNextPlayer(game, playerWithTurn);
		}
	}

	private void dealToNextPlayer(Game game, Player nextPlayer) {
		List<Card> dealedCards = game.getDealer().dealCards();
		Hand playerHand = nextPlayer.getHand();
		for (Card dealedCard : dealedCards) {
			playerHand.addCard(dealedCard);
			this.actionEventListener.onPlayerGetCard(game, nextPlayer, dealedCard);
			this.logger.log(Level.TRACE, "%s ha recibido %s %s", nextPlayer.getName(), dealedCard.getType(),
					dealedCard);
		}
	}

	
	// TODO captura de eventos de dominio, y reaccion a estos, ejemplo: 
	// onPlayerAttackAction -> updateAlivePlayers
	
	
	
	
	
	
	
	
	
	
	
	
}
