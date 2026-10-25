package com.dainws.games.crm.controller.events;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.services.UserService;

import jakarta.annotation.PostConstruct;

@Component
@ConditionalOnProperty(value = "crm.communication.socket-io.enabled", havingValue = "true", matchIfMissing = true)
public class SocketIOConnectionManager {
    private final SocketIOServer server;
    private final UserService userService;

    public SocketIOConnectionManager(SocketIOServer server, UserService userService) {
        this.server = server;
        this.userService = userService;
    }

    @PostConstruct
    public void postConstruct() {
        this.server.addConnectListener(this::onConnected);
        this.server.addDisconnectListener(this::onDisconnected);
    }

    private void onConnected(SocketIOClient client) {
    	String sessionId = String.valueOf(client.getSessionId());
		UserCode userCode = UserCode.from(String.valueOf(sessionId));

        User user = this.userService.get(userCode);
        user.setSessionId(sessionId);
        this.userService.update(user);
    }

    private void onDisconnected(SocketIOClient client) {
    	String sessionId = String.valueOf(client.getSessionId());
		UserCode userCode = UserCode.from(String.valueOf(sessionId));

		this.userService.delete(userCode);
    }
}