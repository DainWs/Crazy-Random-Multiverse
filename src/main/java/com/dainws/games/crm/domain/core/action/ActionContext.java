package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.GameExceptionHandler;
import com.dainws.games.crm.domain.core.player.Player;

public interface ActionContext {

	Game getGame();

	EventPublisher getEventPublisher();

	GameExceptionHandler getGameExceptionHandler();

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
