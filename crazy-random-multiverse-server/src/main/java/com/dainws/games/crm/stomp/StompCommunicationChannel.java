package com.dainws.games.crm.stomp;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.dainws.games.cbg.domain.communication.Destination;
import com.dainws.games.cbg.domain.communication.Error;
import com.dainws.games.cbg.domain.communication.Event;
import com.dainws.games.cbg.domain.communication.GameChannel;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.services.PartyChannel;
import com.dainws.games.crm.stomp.dto.EventDto;
import com.dainws.games.crm.stomp.dto.CommunicationMapper;
import com.dainws.games.crm.stomp.dto.ErrorDto;
import com.dainws.games.crm.stomp.dto.ModelMapper;
import com.dainws.games.crm.stomp.dto.models.PartyDto;
import com.dainws.games.crm.stomp.dto.models.PartyListDto;

public class StompCommunicationChannel implements GameChannel, PartyChannel {

	private SimpMessagingTemplate messagingTemplate;
	private Logger logger;

	public StompCommunicationChannel(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.logger = LoggerFactory.getLogger(StompCommunicationChannel.class.getCanonicalName());
	}

	@Override
	public void send(Destination destination, Error error) {
		this.logger.trace("Enviando error {}, al cliente {}", error.getText(), destination);

		String sessionId = destination.getValue();
		ErrorDto errorDto = new CommunicationMapper().mapErrorToDto(error);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/error", errorDto, createHeaders(sessionId));
	}

	@Override
	public void send(Destination destination, Event event) {
		this.logger.trace("Enviando evento {}, al cliente {}", event.getCode(), destination);

		String sessionId = destination.getValue();
		EventDto eventDto = new CommunicationMapper().mapEventToDto(event);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/event", eventDto, createHeaders(sessionId));
	}

	@Override
	public void sendPartyInfo(Destination destination, Party party) {
		this.logger.trace("Enviando información de la fiesta, al cliente {}", destination);

		String sessionId = destination.getValue();
		PartyDto partyDto = new ModelMapper().mapPartyToPartyDto(party);
		this.messagingTemplate.convertAndSendToUser(sessionId, "/topic/party/info", partyDto, createHeaders(sessionId));
	}

	@Override
	public void sendPartyList(Destination destination, List<Party> party) {
		this.logger.trace("Enviando lista de las fiestas, al cliente {}", destination);

		String sessionId = destination.getValue();
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
