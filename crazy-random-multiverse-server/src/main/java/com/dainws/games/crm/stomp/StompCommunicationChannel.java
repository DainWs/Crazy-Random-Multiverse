package com.dainws.games.crm.stomp;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.dainws.games.cbg.domain.communication.GameChannel;
import com.dainws.games.cbg.domain.communication.Destination;
import com.dainws.games.cbg.domain.communication.Error;
import com.dainws.games.cbg.domain.communication.Event;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.services.PartyChannel;
import com.dainws.games.crm.stomp.dto.EventMapper;
import com.dainws.games.crm.stomp.dto.ModelMapper;
import com.dainws.games.crm.stomp.dto.events.EventDto;
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

		this.messagingTemplate.convertAndSendToUser(destination.getValue(), "/topic/error", error);
	}

	@Override
	public void send(Destination destination, Event event) {
		this.logger.trace("Enviando evento {}, al cliente {}", event.getCode(), destination);

		EventDto eventDto = new EventMapper().mapEventToDto(event);
		this.messagingTemplate.convertAndSendToUser(destination.getValue(), "/topic/event", eventDto);
	}

	@Override
	public void sendPartyInfo(Destination destination, Party party) {
		this.logger.trace("Enviando información de la fiesta, al cliente {}", destination);

		PartyDto partyDto = new ModelMapper().mapPartyToPartyDto(party);
		this.messagingTemplate.convertAndSendToUser(destination.getValue(), "/topic/party/info", partyDto);
	}

	@Override
	public void sendPartyList(Destination destination, List<Party> party) {
		this.logger.trace("Enviando lista de las fiestas, al cliente {}", destination);

		PartyListDto partyListDto = new ModelMapper().mapPartiesToPartyList(party);
		this.messagingTemplate.convertAndSendToUser(destination.getValue(), "/topic/party/list", partyListDto);
	}
}
