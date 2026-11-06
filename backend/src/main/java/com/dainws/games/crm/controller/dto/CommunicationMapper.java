package com.dainws.games.crm.controller.dto;

import java.util.List;

import com.dainws.games.crm.controller.dto.response.CardDto;
import com.dainws.games.crm.controller.dto.response.EventDetailsDto;
import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.core.card.AttackResult;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;

public class CommunicationMapper {

	public EventDto mapToDto(Event event, Player receiver) {
		List<CardDto> hand = this.mapHandToDto(event, receiver);

		EventDto eventDto = new EventDto();
		eventDto.setCode(event.getCode());
		eventDto.setSequence(event.getSequence());
		EventDetails details = event.getDetails();
		if (details != null) {
			EventDetailsDto detailsDto = this.mapEventDetailsToDto(event.getCode(), details, receiver);
			detailsDto.setHand(hand);

			eventDto.setDetails(detailsDto);
		}

		return eventDto;
	}

	private EventDetailsDto mapEventDetailsToDto(EventCode code, EventDetails details, Player receiver) {
		EventDetailsDto detailsDto = new EventDetailsDto();
		detailsDto.setGameDto(ModelMapper.mapGameToDto(details.getGame(), receiver));

		if (details.hasSourcePlayer()) {
			detailsDto.setSourcePlayer(ModelMapper.mapPlayerToDto(details.getSourcePlayer()));
		}

		if (details.hasSourceCard()) {
			detailsDto.setSourceCard(ModelMapper.mapCardToDto(details.getSourceCard()));
		}

		if (details.hasSourceCoordinate()) {
			detailsDto.setSourcePosition(ModelMapper.mapCoordinateToDto(details.getSourceCoordinate()));
		}

		if (details.hasTargetPlayer()) {
			detailsDto.setTargetPlayer(ModelMapper.mapPlayerToDto(details.getTargetPlayer()));
		}

		if (details.hasTargetCard() && this.canSeeTargetCard(code, details, receiver)) {
			detailsDto.setTargetCard(ModelMapper.mapCardToDto(details.getTargetCard()));
		}

		if (details.hasTargetCoordinate()) {
			detailsDto.setTargetPosition(ModelMapper.mapCoordinateToDto(details.getTargetCoordinate()));
		}

		if (details.hasAttackResult()) {
			AttackResult attackResult = details.getAttackResult();
			detailsDto.setArmorDamage(attackResult.armorDamage());
			detailsDto.setHealthDamage(attackResult.healthDamage());
			detailsDto.setTargetDead(attackResult.targetDead());
		}

		return detailsDto;
	}

	private boolean canSeeTargetCard(EventCode code, EventDetails details, Player receiver) {
		return code != EventCode.PLAYER_RECEIVE_CARD || receiver.equals(details.getTargetPlayer());
	}

	private List<CardDto> mapHandToDto(Event event, Player player) {
		if (event.getCode() != EventCode.GAME_SYNC) {
			return null;
		}

		return player.getHand().getCards().stream() //
				.map(ModelMapper::mapCardToDto) //
				.toList();
	}
}
