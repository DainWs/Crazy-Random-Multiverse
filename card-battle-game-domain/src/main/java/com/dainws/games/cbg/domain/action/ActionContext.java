package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.board.Coordinate;
import com.dainws.games.cbg.domain.board.Zone;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;

public interface ActionContext {

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
