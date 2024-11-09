package com.dainws.games.crm.domain.core.exception;

import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;

public interface ExceptionPublisher {
	static final ExceptionPublisher NONE = new NoneExceptionPublisher();

	void publish(List<Player> to, GameExceptionCode exceptionCode);
	
	void publish(Player to, GameExceptionCode exceptionCode);
}
