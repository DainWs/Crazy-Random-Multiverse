package com.dainws.games.crm.controller.dto;

import com.dainws.games.crm.controller.dto.models.CardCodeDto;
import com.dainws.games.crm.controller.dto.models.PositionDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ActionDto {
	@JsonProperty(value = "game", defaultValue = "")
	private String gameCode;
	
	@JsonProperty("source_player")
	private String sourcePlayerCode;
	
	@JsonProperty("source_card")
	private CardCodeDto sourceCardCode;
	
	@JsonProperty("source_position")
	private PositionDto sourcePosition;

	@JsonProperty("target_player")
	private String targetPlayerCode;
	
	@JsonProperty("target_card")
	private CardCodeDto targetCardCode;

	@JsonProperty("target_position")
	private PositionDto targetPosition;

	public String getGameCode() {
		return gameCode;
	}
	
	public void setGameCode(String gameCode) {
		this.gameCode = gameCode;
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
