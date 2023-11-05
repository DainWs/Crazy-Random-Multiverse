package com.dainws.games.cbg.domain.actions;

import com.dainws.games.cbg.domain.Hand;
import com.dainws.games.cbg.domain.Player;
import com.dainws.games.cbg.domain.PlayerCode;
import com.dainws.games.cbg.domain.Position;
import com.dainws.games.cbg.domain.Zone;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public class PutAction implements Action {

	private PlayerCode sourcePlayerCode;
	private CardCode selectedCardCode;
	private Position targetPosition;

	public PutAction(PlayerCode sourcePlayerCode, CardCode selectedCardCode, Position targetPosition) {
		this.sourcePlayerCode = sourcePlayerCode;
		this.selectedCardCode = selectedCardCode;
		this.targetPosition = targetPosition;
	}

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		try {
			Player sourcePlayer = context.getSourcePlayer();
			Position targetPosition = context.getTargetPosition();
			
			Hand playerHand = sourcePlayer.getHand();
			Card card = playerHand.getCard(context.getSourceCardCode());
	
			if (!card.isType(CardType.WARRIOR) && !card.isType(CardType.LEADER)) {
				throw new PlayerActionException("SELECTED_CARD_IS_NOT_A_COMBATANT");
			}
			
			Zone playerZone = sourcePlayer.getZone();
			if (playerZone.hasCombatant(targetPosition)) {
				throw new PlayerActionException("TARGET_POSITION_IS_OCCUPIED");
			}
			
			playerZone.putCombatant((Combatant) card, targetPosition);
			playerHand.remove(card);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}

	public PlayerCode getSourcePlayer() {
		return sourcePlayerCode;
	}

	public CardCode getSelectedCardCode() {
		return selectedCardCode;
	}

	public Position getTargetPosition() {
		return targetPosition;
	}
}
