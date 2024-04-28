package com.dainws.games.crm.controller.dto.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ActionDto {
	@JsonProperty(value = "game", defaultValue = "")
	private String gameCode;

	@JsonProperty(value = "type", defaultValue = "")
	private ActionType type; 
	
	@JsonProperty("sourcePlayer")
	private String sourcePlayerCode;
	
	@JsonProperty("sourceCard")
	private CardCodeDto sourceCardCode;
	
	@JsonProperty("sourcePosition")
	private PositionDto sourcePosition;

	@JsonProperty("targetPlayer")
	private String targetPlayerCode;
	
	@JsonProperty("targetCard")
	private CardCodeDto targetCardCode;

	@JsonProperty("targetPosition")
	private PositionDto targetPosition;

	public String getGameCode() {
		return gameCode;
	}
	
	public void setGameCode(String gameCode) {
		this.gameCode = gameCode;
	}
	
	public ActionType getType() {
		return type;
	}
	
	public void setType(ActionType type) {
		this.type = type;
	}
	
	public String getSourcePlayerCode() {
		return sourcePlayerCode;
	}

	public void setSourcePlayerCode(String sourcePlayerCode) {
		this.sourcePlayerCode = sourcePlayerCode;
	}

	public CardCodeDto getSourceCardCode() {
		return sourceCardCode;
	}

	public void setSourceCardCode(CardCodeDto sourceCardCode) {
		this.sourceCardCode = sourceCardCode;
	}

	public PositionDto getSourcePosition() {
		return sourcePosition;
	}

	public void setSourcePosition(PositionDto sourcePosition) {
		this.sourcePosition = sourcePosition;
	}

	public String getTargetPlayerCode() {
		return targetPlayerCode;
	}

	public void setTargetPlayerCode(String targetPlayerCode) {
		this.targetPlayerCode = targetPlayerCode;
	}

	public CardCodeDto getTargetCardCode() {
		return targetCardCode;
	}

	public void setTargetCardCode(CardCodeDto targetCardCode) {
		this.targetCardCode = targetCardCode;
	}

	public PositionDto getTargetPosition() {
		return targetPosition;
	}

	public void setTargetPosition(PositionDto targetPosition) {
		this.targetPosition = targetPosition;
	}
}
