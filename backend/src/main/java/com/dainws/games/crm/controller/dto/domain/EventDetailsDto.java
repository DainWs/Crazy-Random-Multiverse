package com.dainws.games.crm.controller.dto.domain;

import java.util.List;

import com.dainws.games.crm.usecase.dto.PositionDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EventDetailsDto {
	@JsonProperty(value = "game", required = true)
	private GameDto gameDto;
	
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

	@JsonProperty("hand")
	private List<CardDto> hand;

	public GameDto getGameDto() {
		return gameDto;
	}
	
	public void setGameDto(GameDto gameDto) {
		this.gameDto = gameDto;
	}
	
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

	public List<CardDto> getHand() {
		return hand;
	}

	public void setHand(List<CardDto> hand) {
		this.hand = hand;
	}
}
