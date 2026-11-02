package com.dainws.games.crm.controller.events;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

class CommunicationClientTest {

	CommunicationClient communicationClient;
	User user;
	UserPlayer player;
	Event event;

	@BeforeEach
	void beforeEach() {
		MemoryUserRepository userRepository = new MemoryUserRepository();
		this.user = new User("user-1", "Name", UserPlatform.WEB);
		userRepository.save(this.user);

		SocketIOServer server = new SocketIOServer(new Configuration());
		this.communicationClient =
				new CommunicationClient(userRepository, server);

		this.player = new UserPlayer(this.user);
		Game game = new GameBuilder().withPlayers(this.player).build();
		this.event = new Event(EventCode.TURN_CHANGE, game);
	}

	@Test
	void testGivenUserWithoutOpenSocket_whenSendEvent_thenDoesNotFail() {
		assertDoesNotThrow(
				() -> this.communicationClient.sendEvent(this.player, this.event));
	}

	@Test
	void testGivenUserWithoutOpenSocket_whenSendPartyInfo_thenDoesNotFail() {
		Party party = new Party(this.user, GameModes.CLASSIC);

		assertDoesNotThrow(
				() -> this.communicationClient.sendPartyInfo(this.user, party));
	}

	@Test
	void testGivenUserWhoseSocketIsGone_whenSendEvent_thenDoesNotFail() {
		this.user.setSessionId(UUID.randomUUID().toString());

		assertDoesNotThrow(
				() -> this.communicationClient.sendEvent(this.player, this.event));
	}
}
