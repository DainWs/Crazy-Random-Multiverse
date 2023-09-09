package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;
import com.dainws.games.cbg.domain.player.exception.PlayerActionException;

public class MoveAction implements Action {
	private Player player;
	private Position fromPosition;
	private Position toPosition;

	public MoveAction(Player player, Position fromPosition, Position toPosition) {
		this.player = player;
		this.fromPosition = fromPosition;
		this.toPosition = toPosition;
	}

	@Override
	public void execute() throws PlayerActionException {
		Zone zone = this.player.getZone();
		if (zone.hasCombatant(this.toPosition)) {
			throw new PlayerActionException("La zona destinataria ya esta ocupada.");
		}

		if (!zone.hasCombatant(this.fromPosition)) {
			throw new PlayerActionException("No se ha seleccionado ninguna unidad que mover.");
		}

		Combatant combatant = zone.getCombatant(this.fromPosition);
		zone.removeCombatant(this.fromPosition);
		zone.putCombatant(combatant, this.toPosition);
	}
}
