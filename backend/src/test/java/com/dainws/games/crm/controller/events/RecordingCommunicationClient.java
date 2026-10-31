package com.dainws.games.crm.controller.events;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;

public class RecordingCommunicationClient implements CommunicationClient {
	private List<SentEvent> sentEvents;

	public RecordingCommunicationClient() {
		this.sentEvents = new ArrayList<>();
	}

	@Override
	public void sendExceptionCode(Player player, ExceptionCode code) {
	}

	@Override
	public void sendEvent(Player player, Event event) {
		this.sentEvents.add(new SentEvent(player, event));
	}

	@Override
	public void sendPartyInfo(User to, Party party) {
	}

	public List<SentEvent> getSentEvents() {
		return List.copyOf(this.sentEvents);
	}
}
