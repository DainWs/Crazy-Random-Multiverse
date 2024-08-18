package com.dainws.games.crm.domain.core.effect;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Player;

public interface EffectContext {
	Game getGame();

	Board getBoard();

	Player getSourcePlayer();

	Zone getSourceZone();

	Coordinate getSourceCoordinate();

	Card getSourceCard();

	Player getTargetPlayer();

	Zone getTargetZone();

	Coordinate getTargetCoordinate();

	Card getTargetCard();
}
