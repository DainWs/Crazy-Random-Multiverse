package com.dainws.games.crm.usecase.dto;

import com.dainws.games.crm.domain.core.card.CardType;

import jakarta.validation.constraints.NotNull;

public class CardCodeDto {
	private String code;
	
	@NotNull
	private CardType type;
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public CardType getType() {
		return type;
	}
	
	public void setType(CardType type) {
		this.type = type;
	}
}
