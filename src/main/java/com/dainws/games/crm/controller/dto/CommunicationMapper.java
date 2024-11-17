package com.dainws.games.crm.controller.dto;

import com.dainws.games.crm.controller.dto.domain.EventDetailsDto;
import com.dainws.games.crm.controller.dto.domain.EventDto;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventDetails;

public class CommunicationMapper {

	public EventDto mapToDto(Event event) {
		EventDto eventDto = new EventDto();
		eventDto.setCode(event.getCode());
		EventDetails details = event.getDetails();
		if (details != null) {
			eventDto.setDetails(this.mapEventDetailsToDto(details));
		}

		return eventDto;
	}

	private EventDetailsDto mapEventDetailsToDto(EventDetails details) {
		ModelMapper modelMapper = new ModelMapper();

		EventDetailsDto detailsDto = new EventDetailsDto();
		detailsDto.setGameDto(modelMapper.mapGameToDto(details.getGame()));

		if (details.hasSourcePlayer()) {
			detailsDto.setSourcePlayer(modelMapper.mapPlayerToDto(details.getSourcePlayer()));
		}

		if (details.hasSourceCard()) {
			detailsDto.setSourceCard(modelMapper.mapCardToDto(details.getSourceCard()));
		}

		if (details.hasSourceCoordinate()) {
			detailsDto.setSourcePosition(modelMapper.mapCoordinateToDto(details.getSourceCoordinate()));
		}

		if (details.hasTargetPlayer()) {
			detailsDto.setTargetPlayer(modelMapper.mapPlayerToDto(details.getTargetPlayer()));
		}

		if (details.hasTargetCard()) {
			detailsDto.setTargetCard(modelMapper.mapCardToDto(details.getTargetCard()));
		}

		if (details.hasTargetCoordinate()) {
			detailsDto.setTargetPosition(modelMapper.mapCoordinateToDto(details.getTargetCoordinate()));
		}

		return detailsDto;
	}
}
