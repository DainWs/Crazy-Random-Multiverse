package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public interface GameModeStrategy {
	GameMode getGameMode();

	Dealer createDealer();

	Turn createTurn(PlayerStorage players);

	Board createBoard(PlayerStorage players);

	PlayerStorage createPlayerStorage();

	EventPublisher createEventPublisher(Game game);

	ExceptionPublisher createExceptionPublisher(Game game);

}
