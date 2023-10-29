package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.GameException;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

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
	public void perform() throws PlayerActionException {
		try {
			Zone zone = this.player.getZone();
			if (zone.hasCombatant(this.toPosition)) {
				throw new PlayerActionException("TARGET_POSITION_IS_OCCUPIED");
			}

			if (!zone.hasCombatant(this.fromPosition)) {
				throw new PlayerActionException("NONE_COMBATANT_IN_TARGET_POSITION");
			}

			Combatant combatant = zone.getCombatant(this.fromPosition);
			zone.removeCombatant(this.fromPosition);
			zone.putCombatant(combatant, this.toPosition);
		} catch (GameException gameException) {
			throw new PlayerActionException(gameException);
		}
	}
}
