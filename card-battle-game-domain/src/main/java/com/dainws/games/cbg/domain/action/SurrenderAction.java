package com.dainws.games.cbg.domain.action;

import java.util.Map.Entry;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.communication.GameEventListener;
import com.dainws.games.cbg.domain.communication.PlayerEventListener;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

public class SurrenderAction implements Action {

	private GameEventListener gameEventListener;
	private PlayerEventListener playerEventListener;

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		assert (this.gameEventListener != null && this.playerEventListener != null);

		Player sourcePlayer = context.getSourcePlayer();
		Zone zone = sourcePlayer.getZone();

		for (Entry<Position, Combatant> entry : zone.getPositions().entrySet()) {
			zone.removeCombatant(entry.getKey());
		}
		
		this.playerEventListener.onPlayerSurrenderAction(context);
		this.gameEventListener.onPlayerLoseGame(context.getGame(), sourcePlayer);
	}

	@Override
	public void setGameEventListener(GameEventListener gameEventListener) {
		this.gameEventListener = gameEventListener;
	}

	@Override
	public void setPlayerEventListener(PlayerEventListener playerEventListener) {
		this.playerEventListener = playerEventListener;
	}
}
