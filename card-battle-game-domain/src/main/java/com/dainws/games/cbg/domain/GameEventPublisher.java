package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.effect.Effect;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.actions.Action;

public interface GameEventPublisher {
	void onGameStart();
	
	void onSpellEffect(Effect effect);

	void onPlayerPerformAction(Player player, Action action);
	
	void onPlayerGetTurn(Player player);

	void onPlayerLose(Player player);

	void onPlayerWins(Player player);
}
