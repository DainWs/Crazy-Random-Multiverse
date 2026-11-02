package com.dainws.games.crm.controller.dto.response;

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

	@JsonProperty("armorDamage")
	private Double armorDamage;

	@JsonProperty("healthDamage")
	private Double healthDamage;

	@JsonProperty("targetDead")
	private Boolean targetDead;

	@JsonProperty("hand")
	private List<CardDto> hand;

	public Double getArmorDamage() {
		return armorDamage;
	}

	public void setArmorDamage(Double armorDamage) {
		this.armorDamage = armorDamage;
	}

	public Double getHealthDamage() {
		return healthDamage;
	}

	public void setHealthDamage(Double healthDamage) {
		this.healthDamage = healthDamage;
	}

	public Boolean getTargetDead() {
		return targetDead;
	}

	public void setTargetDead(Boolean targetDead) {
		this.targetDead = targetDead;
	}

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
