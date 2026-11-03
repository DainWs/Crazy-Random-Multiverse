package com.dainws.games.crm.controller.events;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;

public class StubSocketIOServer extends SocketIOServer {
	private Map<UUID, SocketIOClient> clients;

	public StubSocketIOServer() {
		super(new Configuration());
		this.clients = new HashMap<>();
	}

	public void addClient(UUID socketId, SocketIOClient client) {
		this.clients.put(socketId, client);
	}

	@Override
	public SocketIOClient getClient(UUID uuid) {
		return this.clients.get(uuid);
	}
}
