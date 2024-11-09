package com.dainws.games.crm.domain.core.exception;

import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;

public abstract class CompositeExceptionPublisher implements ExceptionPublisher {

	private ExceptionPublisher wrapper;

	protected CompositeExceptionPublisher(ExceptionPublisher wrapper) {
		this.wrapper = wrapper;
	}

	@Override
	public void publish(List<Player> to, GameExceptionCode exceptionCode) {
		this.wrapper.publish(to, exceptionCode);
	}

	@Override
	public void publish(Player to, GameExceptionCode exceptionCode) {
		this.wrapper.publish(to, exceptionCode);
	}
}
