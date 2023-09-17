package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

public class AttackAction implements Action {

	private Player sourcePlayer;
	private Position sourcePosition;

	private Player targetPlayer;
	private Position targetPosition;

	public AttackAction(Player sourcePlayer, Position sourcePosition, Player targetPlayer, Position targetPosition) {
		this.sourcePlayer = sourcePlayer;
		this.sourcePosition = sourcePosition;
		this.targetPlayer = targetPlayer;
		this.targetPosition = targetPosition;
	}

	@Override
	public void perform() {
		Zone sourceZone = this.sourcePlayer.getZone();
		Combatant sourceCombatant = sourceZone.getCombatant(this.sourcePosition);

		Zone targetZone = this.targetPlayer.getZone();
		Combatant targetCombatant = targetZone.getCombatant(this.targetPosition);

		targetCombatant.receiveDamageFrom(sourceCombatant);

		if (!targetCombatant.isAlive()) {
			targetZone.removeCombatant(this.targetPosition);
		}
	}
}
