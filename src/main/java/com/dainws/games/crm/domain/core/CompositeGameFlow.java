package com.dainws.games.crm.domain.core;

public abstract class CompositeGameFlow implements GameFlow {

	private GameFlow wrapper;
	
	protected CompositeGameFlow(GameFlow wrapper) {
		this.wrapper = wrapper;
	}
	
	@Override
	public void onRestartGame(Game game) {
		this.wrapper.onRestartGame(game);
	}

	@Override
	public void onStartGame(Game game) {
		this.wrapper.onStartGame(game);
	}

	@Override
	public void onEndGame(Game game) {
		this.wrapper.onEndGame(game);
	}

	@Override
	public void onNextTurn(Game game) {
		this.wrapper.onNextTurn(game);
	}

	@Override
	public void onPrevTurn(Game game) {
		this.wrapper.onPrevTurn(game);
	}

	@Override
	public void updateGame(Game game) {
		this.wrapper.updateGame(game);
	}
	
}
