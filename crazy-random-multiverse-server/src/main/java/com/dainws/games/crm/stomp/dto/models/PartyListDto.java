package com.dainws.games.crm.stomp.dto.models;

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
