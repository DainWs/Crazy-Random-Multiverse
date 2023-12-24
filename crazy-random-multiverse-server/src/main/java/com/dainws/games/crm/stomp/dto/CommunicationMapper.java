package com.dainws.games.crm.stomp.dto;

import com.dainws.games.cbg.domain.communication.Error;
import com.dainws.games.cbg.domain.communication.Event;
import com.dainws.games.cbg.domain.communication.EventDetails;
import com.dainws.games.cbg.domain.translator.Text;

public class CommunicationMapper {
	public ErrorDto mapErrorToDto(Error error) {
		ErrorDto errorDto = new ErrorDto();
		Text text = error.getText();
		errorDto.setKey(text.getKey().getValue());
		errorDto.setValue(text.getValue());
		errorDto.setLanguage(text.getLanguage().getIsoAlphaTwo());
		return errorDto;
	}

	public EventDto mapEventToDto(Event event) {
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

		if (details.hasSourcePosition()) {
			detailsDto.setSourcePosition(modelMapper.mapPositionToDto(details.getSourcePosition()));
		}

		if (details.hasTargetPlayer()) {
			detailsDto.setTargetPlayer(modelMapper.mapPlayerToDto(details.getTargetPlayer()));
		}

		if (details.hasTargetCard()) {
			detailsDto.setTargetCard(modelMapper.mapCardToDto(details.getTargetCard()));
		}

		if (details.hasTargetPosition()) {
			detailsDto.setTargetPosition(modelMapper.mapPositionToDto(details.getTargetPosition()));
		}

		return detailsDto;
	}
}
