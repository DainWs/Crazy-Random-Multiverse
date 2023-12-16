package com.dainws.games.crm.stomp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.dainws.games.cbg.domain.communication.Channel;
import com.dainws.games.cbg.domain.communication.Destination;
import com.dainws.games.cbg.domain.communication.Error;
import com.dainws.games.cbg.domain.communication.Event;
import com.dainws.games.crm.stomp.dto.EventMapper;
import com.dainws.games.crm.stomp.dto.events.EventDto;

public class StompCommunicationChannel implements Channel {

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
}
