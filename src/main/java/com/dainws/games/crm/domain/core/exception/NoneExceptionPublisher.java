package com.dainws.games.crm.domain.core.exception;

import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;

class NoneExceptionPublisher implements ExceptionPublisher {

	NoneExceptionPublisher() {
	}

	@Override
	public void publish(List<Player> to, GameExceptionCode exceptionCode) {
	}

	@Override
	public void publish(Player to, GameExceptionCode exceptionCode) {
	}

}
