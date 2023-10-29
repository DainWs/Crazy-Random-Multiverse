package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

public class EquipAction implements Action {
	private Player player;
	private CardCode equipmentCardCode;
	private Position targetPosition;
	
	public EquipAction(Player player, CardCode equipmentCardCode, Position targetPosition) {
		this.player = player;
		this.equipmentCardCode = equipmentCardCode;
		this.targetPosition = targetPosition;
	}

	@Override
	public void perform() throws PlayerActionException {
		try {
			Hand playerHand = this.player.getHand();
			Card card = playerHand.getCard(this.equipmentCardCode);
			
			if (!card.isType(CardType.EQUIPMENT)) {
				throw new PlayerActionException("SELECTED_CARD_IS_NOT_EQUIPMENT");
			}
			
			Zone zone = this.player.getZone();
			Combatant combatant = zone.getCombatant(this.targetPosition);
			combatant.equip((Equipment) card);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}
}
