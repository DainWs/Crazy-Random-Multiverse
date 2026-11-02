package com.dainws.games.crm.controller.events;

import java.util.ArrayList;
import java.util.List;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

public class RecordingCommunicationClient extends CommunicationClient {
	private List<SentEvent> sentEvents;

	public RecordingCommunicationClient() {
		super(new MemoryUserRepository(), new SocketIOServer(new Configuration()));
		this.sentEvents = new ArrayList<>();
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
