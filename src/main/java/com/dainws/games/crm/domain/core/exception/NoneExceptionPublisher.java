package com.dainws.games.crm.domain.core.exception;

import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;

public class NoneExceptionPublisher implements ExceptionPublisher {

	public NoneExceptionPublisher() {
	}

	@Override
	public void publish(List<Player> to, ExceptionCode exceptionCode) {
	}

	@Override
	public void publish(Player to, ExceptionCode exceptionCode) {
	}

}
