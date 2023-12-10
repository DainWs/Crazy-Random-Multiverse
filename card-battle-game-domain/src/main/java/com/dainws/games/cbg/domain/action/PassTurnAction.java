package com.dainws.games.cbg.domain.action;

import java.lang.System.Logger.Level;
import java.util.List;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;

public class PassTurnAction extends PlayerTurnAction {

	@Override
	protected void performPlayerAction(ActionContext context) throws PlayerActionException {
		assert (this.gameEventListener != null && this.playerEventListener != null);

		Game game = context.getGame();

		game.nextTurn();
		this.playerEventListener.onPlayerPassTurnAction(context);

		Player playerWithTurn = game.getPlayerWithTurn();
		this.logger.log(Level.TRACE, "Ahora el turno es para %s", playerWithTurn.getName());
		this.playerEventListener.onPlayerGetTurn(game, playerWithTurn);

		List<Card> dealedCards = game.getDealer().dealCards();
		Hand playerHand = playerWithTurn.getHand();
		for (Card dealedCard : dealedCards) {
			playerHand.addCard(dealedCard);
			this.playerEventListener.onPlayerGetCard(game, playerWithTurn, dealedCard);
			this.logger.log(Level.TRACE, "%s ha recibido %s %s", playerWithTurn.getName(), dealedCard.getType(),
					dealedCard);
		}
	}

}
