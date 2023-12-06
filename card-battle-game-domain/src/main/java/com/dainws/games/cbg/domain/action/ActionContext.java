package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

public interface ActionContext {

	Game getGame();

	Player getSourcePlayer();
	
	Zone getSourceZone();

	Position getSourcePosition();

	Card getSourceCard();

	Player getTargetPlayer();
	
	Zone getTargetZone();

	Position getTargetPosition();

	Card getTargetCard();
}
