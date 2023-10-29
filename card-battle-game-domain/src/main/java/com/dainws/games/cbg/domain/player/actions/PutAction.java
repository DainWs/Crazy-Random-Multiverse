package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

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
		try {
			Hand playerHand = this.sourcePlayer.getHand();
			Card card = playerHand.getCard(this.selectedCardCode);
	
			if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
				throw new PlayerActionException("SELECTED_CARD_IS_NOT_A_COMBATANT");
			}
			
			Zone playerZone = this.sourcePlayer.getZone();
			if (playerZone.hasCombatant(this.targetPosition)) {
				throw new PlayerActionException("TARGET_POSITION_IS_OCCUPIED");
			}
			
			playerZone.putCombatant((Combatant) card, this.targetPosition);
			playerHand.remove(card);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}

	public Player getSourcePlayer() {
		return sourcePlayer;
	}

	public CardCode getSelectedCardCode() {
		return selectedCardCode;
	}

	public Position getTargetPosition() {
		return targetPosition;
	}
}
