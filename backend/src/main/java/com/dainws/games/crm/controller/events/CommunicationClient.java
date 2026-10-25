package com.dainws.games.crm.controller.events;

import java.util.List;

import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.Player;

public interface CommunicationClient extends UserClient, ExceptionPublisher {

	@Override
	default void publish(List<Player> to, ExceptionCode exceptionCode) {
		for (Player player : to) {
			this.sendExceptionCode(player, exceptionCode);
		}
	}

	@Override
	default void publish(Player to, ExceptionCode exceptionCode) {
		this.sendExceptionCode(to, exceptionCode);
	}

	void sendExceptionCode(Player player, ExceptionCode code);

	void sendEvent(Player player, Event event);
}
