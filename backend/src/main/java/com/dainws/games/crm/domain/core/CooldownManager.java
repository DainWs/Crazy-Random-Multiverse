package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.player.Player;

public class CooldownManager {

	public void updatePlayerCooldowns(Game game, Player player) {
		Player playerWithTurn = game.getPlayerWithTurn();
		Zone zone = game.getPlayerZone(playerWithTurn);
		
		Combatant[][] combatantMatrix = zone.getCombatants();
		for (Combatant[] combatants : combatantMatrix) {
			for (Combatant combatant : combatants) {
				if (combatant != null) {
					combatant.update();
				}
			}
		}
	}
}
