package com.dainws.games.crm.domain.core;

public interface GameFlow {

	void onRestartGame(Game game);

	void onStartGame(Game game);

	void onEndGame(Game game);

	void onNextTurn(Game game);

	void onPrevTurn(Game game);

	void updateGame(Game game);

}
