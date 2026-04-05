package com.dainws.games.crm.controller.dto.domain;

import java.util.List;

public class PartyListDto {
	private List<PartyDto> parties;
	
	public void setParties(List<PartyDto> parties) {
		this.parties = parties;
	}
	
	public List<PartyDto> getParties() {
		return parties;
	}
}
