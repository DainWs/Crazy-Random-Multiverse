package com.dainws.games.crm.controller.events;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.controller.dto.CommunicationMapper;
import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.repositories.UserRepository;

@Component
@ConditionalOnProperty(value = "crm.communication.socket-io.enabled", havingValue = "true", matchIfMissing = true)
public class CommunicationClient implements UserClient {
	public static final String GAME_EVENT_CHANNEL = "game:event";
	public static final String PARTY_INFO_CHANNEL = "party:info";
	public static final String USER_SYNCED_CHANNEL = "user:synced";

	private Logger logger;

	private SocketIOServer server;
	private UserRepository userRepository;

	public CommunicationClient(UserRepository userRepository, SocketIOServer server) {
		this.server = server;
		this.userRepository = userRepository;
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void sendEvent(Player player, EventDto eventDto) {
		if (this.canSendTo(player)) {
			for (SocketIOClient client : this.findClientsOf(player)) {
				this.sendEvent(client, player, eventDto);
			}
		}
	}

	public void sendEvent(SocketIOClient client, Player player, Event event) {
		if (this.canSendTo(player)) {
			this.sendEvent(client, player, new CommunicationMapper().mapToDto(event, player));
		}
	}

	private void sendEvent(SocketIOClient client, Player player, EventDto eventDto) {
		this.logger.debug("Sending event {} to client {}", eventDto.getCode(), player.getName());

		client.sendEvent(GAME_EVENT_CHANNEL, eventDto);
	}

	public void sendPartyInfo(SocketIOClient client, Party party) {
		this.logger.trace("Sending party {} information to client {}", party.getCode(), client.getSessionId());

		client.sendEvent(PARTY_INFO_CHANNEL, ModelMapper.toPartyDto(party));
	}

	public void sendUserSynced(SocketIOClient client) {
		this.logger.trace("Sending the synced signal to client {}", client.getSessionId());

		client.sendEvent(USER_SYNCED_CHANNEL);
	}

	private boolean canSendTo(Player player) {
		if (player instanceof UserPlayer userPlayer) {
			return userPlayer.isPlayingOn(UserPlatform.WEB);
		}

		return false;
	}

	private List<SocketIOClient> findClientsOf(Player player) {
		return this.findClientsOf(UserCode.from(player.getCode()));
	}

	private List<SocketIOClient> findClientsOf(UserCode code) {
		if (!this.userRepository.has(code)) {
			return List.of();
		}

		User user = this.userRepository.find(code);
		List<SocketIOClient> clients = new ArrayList<>();
		for (String socketId : user.getSocketIds()) {
			SocketIOClient client = this.server.getClient(UUID.fromString(socketId));
			if (client != null) {
				clients.add(client);
			}
		}

		if (clients.isEmpty()) {
			this.logger.debug("User {} has no open connection", user.getName());
		}

		return clients;
	}

	@Override
	public void sendPartyInfo(User to, Party party) {
		this.logger.trace("Sending party information to client {}", to.getName());

		for (SocketIOClient client : this.findClientsOf(to.getCode())) {
			this.sendPartyInfo(client, party);
		}
	}
}
