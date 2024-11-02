package com.dainws.games.crm.domain.core;

public interface GameFlowService<T extends Game> {

	void resetGame(T game);

	void startGame(T game);

	void endGame(T game);

	void nextTurn(T game);

	void prevTurn(T game);

	void updateGame(T game);

}
