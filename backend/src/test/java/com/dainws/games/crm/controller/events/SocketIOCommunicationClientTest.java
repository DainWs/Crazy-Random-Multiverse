package com.dainws.games.crm.controller.events;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

class SocketIOCommunicationClientTest {

	private SocketIOServer server;
	private SocketIOCommunicationClient communicationClient;
	private User user;
	private UserPlayer player;
	private Event event;

	@BeforeEach
	void beforeEach() {
		MemoryUserRepository userRepository = new MemoryUserRepository();
		this.user = new User("user-1", "Name", UserPlatform.WEB);
		userRepository.save(this.user);

		this.server = mock(SocketIOServer.class);
		this.communicationClient =
				new SocketIOCommunicationClient(userRepository, this.server);

		this.player = new UserPlayer(this.user);
		Game game = new GameBuilder().withPlayers(this.player).build();
		this.event = new Event(EventCode.TURN_CHANGE, game);
	}

	@Test
	void testGivenUserWithoutOpenSocket_whenSendEvent_thenNothingIsSent() {
		this.communicationClient.sendEvent(this.player, this.event);

		verify(this.server, never()).getClient(any());
	}

	@Test
	void testGivenUserWhoseSocketIsGone_whenSendEvent_thenDoesNotFail() {
		this.user.setSessionId(UUID.randomUUID().toString());

		this.communicationClient.sendEvent(this.player, this.event);

		verify(this.server).getClient(UUID.fromString(this.user.getSessionId()));
	}
}
