package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.CommunicationMapper;
import com.dainws.games.crm.controller.dto.response.EventDto;
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

	private static final String GAME_EVENT_CHANNEL = "game:event";
	private static final String PARTY_INFO_CHANNEL = "party:info";

	CommunicationClient communicationClient;
	StubSocketIOServer server;
	User user;
	UserPlayer player;
	EventDto eventDto;

	@BeforeEach
	void beforeEach() {
		MemoryUserRepository userRepository = new MemoryUserRepository();
		this.user = new User("user-1", "Name", UserPlatform.WEB);
		userRepository.save(this.user);

		this.server = new StubSocketIOServer();
		this.communicationClient =
				new CommunicationClient(userRepository, this.server);

		this.player = new UserPlayer(this.user);
		Game game = new GameBuilder().withPlayers(this.player).build();
		Event event = new Event(EventCode.TURN_CHANGE, game);
		this.eventDto = new CommunicationMapper().mapToDto(event, this.player);
	}

	@Test
	void testGivenUserWithoutOpenSocket_whenSendEvent_thenDoesNotFail() {
		assertDoesNotThrow(
				() -> this.communicationClient.sendEvent(this.player, this.eventDto));
	}

	@Test
	void testGivenUserWithoutOpenSocket_whenSendPartyInfo_thenDoesNotFail() {
		Party party = new Party(this.user, GameModes.CLASSIC);

		assertDoesNotThrow(
				() -> this.communicationClient.sendPartyInfo(this.user, party));
	}

	@Test
	void testGivenUserWhoseSocketIsGone_whenSendEvent_thenDoesNotFail() {
		this.user.bindSocket(UUID.randomUUID().toString());

		assertDoesNotThrow(
				() -> this.communicationClient.sendEvent(this.player, this.eventDto));
	}

	@Test
	void testGivenUserWithTwoSockets_whenSendEvent_thenBothReceiveIt() {
		RecordingSocketIOClient first = this.bindSocket();
		RecordingSocketIOClient second = this.bindSocket();

		this.communicationClient.sendEvent(this.player, this.eventDto);

		assertThat(first.getSentChannels()).containsExactly(GAME_EVENT_CHANNEL);
		assertThat(second.getSentChannels()).containsExactly(GAME_EVENT_CHANNEL);
	}

	@Test
	void testGivenUserWithTwoSockets_whenSendPartyInfo_thenBothReceiveIt() {
		RecordingSocketIOClient first = this.bindSocket();
		RecordingSocketIOClient second = this.bindSocket();
		Party party = new Party(this.user, GameModes.CLASSIC);

		this.communicationClient.sendPartyInfo(this.user, party);

		assertThat(first.getSentChannels()).containsExactly(PARTY_INFO_CHANNEL);
		assertThat(second.getSentChannels()).containsExactly(PARTY_INFO_CHANNEL);
	}

	private RecordingSocketIOClient bindSocket() {
		UUID socketId = UUID.randomUUID();
		RecordingSocketIOClient client = new RecordingSocketIOClient(socketId, null);
		this.server.addClient(socketId, client.asClient());
		this.user.bindSocket(socketId.toString());
		return client;
	}
}
