package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;
import com.dainws.games.cbg.domain.player.exception.PlayerActionException;

public class PutAction implements Action {

	private Player sourcePlayer;
	private CardCode selectedCardCode;
	private Position targetPosition;

	public PutAction(Player sourcePlayer, CardCode selectedCardCode, Position targetPosition) {
		this.sourcePlayer = sourcePlayer;
		this.selectedCardCode = selectedCardCode;
		this.targetPosition = targetPosition;
	}

	@Override
	public void perform() throws PlayerActionException {
		Hand playerHand = this.sourcePlayer.getHand();
		Card card = playerHand.getCard(this.selectedCardCode);

		if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
			throw new PlayerActionException("La carta seleccionada no es de tipo combatiente");
		}
		
		Zone playerZone = this.sourcePlayer.getZone();
		playerZone.putCombatant((Combatant) card, this.targetPosition);
		playerHand.remove(card);
	}
}
