package com.dainws.games.crm.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.dainws.games.crm.controller.dto.CommunicationMapper;
import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.models.EventDto;
import com.dainws.games.crm.controller.dto.models.ExceptionCodeDto;
import com.dainws.games.crm.controller.dto.models.PartyDto;
import com.dainws.games.crm.controller.dto.models.PartyListDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.exception.GameExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;

public class CommunicationClient implements UserClient, ExceptionPublisher {

	private SimpMessagingTemplate messagingTemplate;
	private Logger logger;

	public CommunicationClient(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.logger = LoggerFactory.getLogger(CommunicationClient.class.getCanonicalName());
	}

	@Override
	public void publish(List<Player> to, GameExceptionCode exceptionCode) {
		for (Player player : to) {
			this.sendExceptionCode(player, exceptionCode);
		}
	}
	
	@Override
	public void publish(Player to, GameExceptionCode exceptionCode) {
		this.sendExceptionCode(to, exceptionCode);
	}
	
	public void sendExceptionCode(Player player, GameExceptionCode code) {
		if (this.canSendTo(player)) {
			this.logger.trace("Enviando error {}, al cliente {}", code, player.getName());

			String sessionId = player.getCode();
			ExceptionCodeDto dto = new ExceptionCodeDto(code.value());
			this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/error", dto, createHeaders(sessionId));
		}
	}

	public void sendEvent(Player player, Event event) {
		if (this.canSendTo(player)) {
			this.logger.trace("Enviando evento {}, al cliente {}", event.getCode(), player.getName());

			String sessionId = player.getCode();
			EventDto eventDto = new CommunicationMapper().mapToDto(event);
			this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/event", eventDto, createHeaders(sessionId));
		}
	}

	private boolean canSendTo(Player player) {
		if (player instanceof UserPlayer userPlayer) {
			return userPlayer.isPlayingOn(UserPlatform.WEB);
		}

		return false;
	}

	@Override
	public void sendPartyInfo(User to, Party party) {
		this.logger.trace("Enviando información de la fiesta, al cliente {}", to.getName());

		String sessionId = to.getCode().getValue();
		PartyDto partyDto = new ModelMapper().mapPartyToPartyDto(party);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/party/info", partyDto, createHeaders(sessionId));
	}

	@Override
	public void sendPartyList(User to, List<Party> party) {
		this.logger.trace("Enviando lista de las fiestas, al cliente {}", to.getName());

		String sessionId = to.getCode().getValue();
		PartyListDto partyListDto = new ModelMapper().mapPartiesToPartyList(party);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/party/list", partyListDto,
				createHeaders(sessionId));
	}

	private MessageHeaders createHeaders(String sessionId) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		return headerAccessor.getMessageHeaders();
	}
}
