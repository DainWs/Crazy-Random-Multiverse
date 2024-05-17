package com.dainws.games.crm.domain.models.action;

import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.board.Board;
import com.dainws.games.crm.domain.models.board.Coordinate;
import com.dainws.games.crm.domain.models.board.Zone;
import com.dainws.games.crm.domain.models.card.Card;
import com.dainws.games.crm.domain.models.player.Player;

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
