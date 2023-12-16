package com.dainws.games.crm.stomp.dto.events;

import com.dainws.games.crm.stomp.dto.models.CardDto;
import com.dainws.games.crm.stomp.dto.models.PlayerDto;
import com.dainws.games.crm.stomp.dto.models.PositionDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EventDetailsDto {
	@JsonProperty("sourcePlayer")
	private PlayerDto sourcePlayer;

	@JsonProperty("sourceCard")
	private CardDto sourceCard;

	@JsonProperty("sourcePosition")
	private PositionDto sourcePosition;

	@JsonProperty("targetPlayer")
	private PlayerDto targetPlayer;

	@JsonProperty("targetCard")
	private CardDto targetCard;

	@JsonProperty("targetPosition")
	private PositionDto targetPosition;

	public PlayerDto getSourcePlayer() {
		return sourcePlayer;
	}

	public void setSourcePlayer(PlayerDto sourcePlayer) {
		this.sourcePlayer = sourcePlayer;
	}

	public CardDto getSourceCard() {
		return sourceCard;
	}

	public void setSourceCard(CardDto sourceCard) {
		this.sourceCard = sourceCard;
	}

	public PositionDto getSourcePosition() {
		return sourcePosition;
	}

	public void setSourcePosition(PositionDto sourcePosition) {
		this.sourcePosition = sourcePosition;
	}

	public PlayerDto getTargetPlayer() {
		return targetPlayer;
	}

	public void setTargetPlayer(PlayerDto targetPlayer) {
		this.targetPlayer = targetPlayer;
	}

	public CardDto getTargetCard() {
		return targetCard;
	}

	public void setTargetCard(CardDto targetCard) {
		this.targetCard = targetCard;
	}

	public PositionDto getTargetPosition() {
		return targetPosition;
	}

	public void setTargetPosition(PositionDto targetPosition) {
		this.targetPosition = targetPosition;
	}
}
