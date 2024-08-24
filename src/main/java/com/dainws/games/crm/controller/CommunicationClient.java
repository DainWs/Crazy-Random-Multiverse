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
import com.dainws.games.crm.controller.dto.models.ErrorDto;
import com.dainws.games.crm.controller.dto.models.EventDto;
import com.dainws.games.crm.controller.dto.models.PartyDto;
import com.dainws.games.crm.controller.dto.models.PartyListDto;
import com.dainws.games.crm.domain.core.Party;
import com.dainws.games.crm.domain.core.User;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.error.Error;
import com.dainws.games.crm.services.UserClient;

public class CommunicationClient implements UserClient {

	private SimpMessagingTemplate messagingTemplate;
	private Logger logger;

	public CommunicationClient(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.logger = LoggerFactory.getLogger(CommunicationClient.class.getCanonicalName());
	}

	public void sendError(Player player, Error error) {
		this.logger.trace("Enviando error {}, al cliente {}", error.getText(), player.getName());

		String sessionId = player.getCode();
		ErrorDto errorDto = new CommunicationMapper().mapErrorToDto(error);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/error", errorDto, createHeaders(sessionId));
	}

	public void sendEvent(Player player, Event event) {
		this.logger.trace("Enviando evento {}, al cliente {}", event.getCode(), player.getName());

		String sessionId = player.getCode();
		EventDto eventDto = new CommunicationMapper().mapEventToDto(event);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/event", eventDto, createHeaders(sessionId));
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
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/party/list", partyListDto, createHeaders(sessionId));
	}
	
	private MessageHeaders createHeaders(String sessionId) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		return headerAccessor.getMessageHeaders();
	}
}
