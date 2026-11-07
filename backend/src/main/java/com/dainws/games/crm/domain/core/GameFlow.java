package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.player.Player;

public interface GameFlow {

	void onStartGame(Game game);

	void onEndGame(Game game);

	void onNextTurn(Game game);

	void onPrevTurn(Game game);

	void updateGame(Game game);

	void eliminatePlayer(Game game, Player player);

}
