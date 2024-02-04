package com.dainws.games.crm.stomp.dto;

import com.dainws.games.crm.stomp.dto.models.CardCodeDto;
import com.dainws.games.crm.stomp.dto.models.PositionDto;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotNull;

public class PlayerPutCardRequest {
	@NotNull
	@JsonProperty("card")
	private CardCodeDto sourceCardCode;

	@NotNull
	@JsonProperty("coordinate")
	private PositionDto targetPosition;

	public CardCodeDto getSourceCardCode() {
		return sourceCardCode;
	}

	public void setSourceCardCode(CardCodeDto sourceCardCode) {
		this.sourceCardCode = sourceCardCode;
	}

	public PositionDto getTargetPosition() {
		return targetPosition;
	}
	
	public void setTargetPosition(PositionDto targetPosition) {
		this.targetPosition = targetPosition;
	}
}
