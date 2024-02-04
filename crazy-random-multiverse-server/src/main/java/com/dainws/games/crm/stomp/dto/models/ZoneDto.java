package com.dainws.games.crm.stomp.dto.models;

import jakarta.validation.constraints.NotNull;

public class ZoneDto {
	@NotNull
	private PlayerDto owner;
	
	@NotNull
	private CardDto[][] combatants;
	
	public void setOwner(PlayerDto owner) {
		this.owner = owner;
	}
	
	public PlayerDto getOwner() {
		return owner;
	}
	
	public void setCombatants(CardDto[][] combatants) {
		this.combatants = combatants;
	}
	
	public CardDto[][] getCombatants() {
		return combatants;
	}
}
