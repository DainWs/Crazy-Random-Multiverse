package com.dainws.games.crm.controller.events;

import java.util.Optional;
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
import com.dainws.games.crm.controller.dto.response.PartyDto;
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

	private Logger logger;

	private SocketIOServer server;
	private UserRepository userRepository;

	public CommunicationClient(UserRepository userRepository, SocketIOServer server) {
		this.server = server;
		this.userRepository = userRepository;
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void sendEvent(Player player, Event event) {
		if (this.canSendTo(player)) {
			this.logger.debug("Sending event {} to client {}", event.getCode(), player.getName());

			EventDto eventDto = new CommunicationMapper().mapToDto(event, player);

			this.findClientOf(player)
				.ifPresent(client -> client.sendEvent("game:event", eventDto));
		}
	}

	private boolean canSendTo(Player player) {
		if (player instanceof UserPlayer userPlayer) {
			return userPlayer.isPlayingOn(UserPlatform.WEB);
		}

		return false;
	}

	private Optional<SocketIOClient> findClientOf(Player player) {
		return this.findClientOf(this.getUserFrom(player));
	}

	private Optional<SocketIOClient> findClientOf(User user) {
		String sessionId = user.getSessionId();
		if (sessionId == null) {
			this.logger.debug("User {} has no open connection", user.getName());
			return Optional.empty();
		}

		return Optional.ofNullable(this.server.getClient(UUID.fromString(sessionId)));
	}

	private User getUserFrom(Player player) {
		UserCode code = UserCode.from(player.getCode());
		return this.userRepository.find(code);
	}

	@Override
	public void sendPartyInfo(User to, Party party) {
		this.logger.trace("Sending party information to client {}", to.getName());

		PartyDto partyDto = ModelMapper.toPartyDto(party);

		this.findClientOf(to)
			.ifPresent(client -> client.sendEvent("party:info", partyDto));
	}
}
