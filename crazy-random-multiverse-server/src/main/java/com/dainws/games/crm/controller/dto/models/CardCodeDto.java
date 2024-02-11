package com.dainws.games.crm.controller.dto.models;

import com.dainws.games.cbg.domain.card.CardType;

import jakarta.validation.constraints.NotNull;

public class CardCodeDto {
	private long code;
	
	@NotNull
	private CardType type;
	
	public long getCode() {
		return code;
	}
	
	public void setCode(long code) {
		this.code = code;
	}
	
	public CardType getType() {
		return type;
	}
	
	public void setType(CardType type) {
		this.type = type;
	}
}
