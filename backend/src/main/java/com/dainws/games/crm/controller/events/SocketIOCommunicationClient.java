package com.dainws.games.crm.controller.events;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOServer;
import com.dainws.games.crm.controller.dto.CommunicationMapper;
import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.domain.EventDto;
import com.dainws.games.crm.controller.dto.domain.ExceptionCodeDto;
import com.dainws.games.crm.controller.dto.domain.PartyDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.repositories.UserRepository;

@Component
@ConditionalOnProperty(value = "crm.communication.socket-io.enabled", havingValue = "true", matchIfMissing = true)
public class SocketIOCommunicationClient implements CommunicationClient {

	private SocketIOServer server;
	private UserRepository userRepository;

	private Logger logger;

	public SocketIOCommunicationClient(UserRepository userRepository, SocketIOServer server) {
		this.server = server;
		this.userRepository = userRepository;
		this.logger = LoggerFactory.getLogger(SocketIOCommunicationClient.class.getCanonicalName());
	}

	@Override
	public void sendExceptionCode(Player player, ExceptionCode code) {
		if (this.canSendTo(player)) {
			this.logger.info("Enviando error {}, al cliente {}", code, player.getName());

			User user = this.getUserFrom(player);
			String sessionId = user.getSessionId();
			ExceptionCodeDto dto = new ExceptionCodeDto(code.value());

			this.server.getClient(UUID.fromString(sessionId))
				.sendEvent("error", dto);
		}
	}

	@Override
	public void sendEvent(Player player, Event event) {
		if (this.canSendTo(player)) {
			this.logger.info("Enviando evento {}, al cliente {}", event.getCode(), player.getName());

			User user = this.getUserFrom(player);
			String sessionId = user.getSessionId();
			EventDto eventDto = new CommunicationMapper().mapToDto(event, player);
			
			this.server.getClient(UUID.fromString(sessionId))
				.sendEvent("game:event", eventDto);
		}
	}

	private boolean canSendTo(Player player) {
		if (player instanceof UserPlayer userPlayer) {
			return userPlayer.isPlayingOn(UserPlatform.WEB);
		}

		return false;
	}

	private User getUserFrom(Player player) {
		UserCode code = UserCode.from(player.getCode());
		return this.userRepository.find(code);
	}

	@Override
	public void sendPartyInfo(User to, Party party) {
		this.logger.trace("Enviando información de la fiesta, al cliente {}", to.getName());

		String sessionId = to.getCode().text();
		PartyDto partyDto = ModelMapper.toPartyDto(party);

		this.server.getClient(UUID.fromString(sessionId))
			.sendEvent("party:info", partyDto);
	}
}
