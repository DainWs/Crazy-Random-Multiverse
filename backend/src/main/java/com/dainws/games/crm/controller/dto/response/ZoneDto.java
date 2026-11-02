package com.dainws.games.crm.controller.dto.response;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public class ZoneDto {
	@NotNull
	private PlayerDto owner;

	@NotNull
	private String type;

	@NotNull
	private ZoneSlotDto[][] combatants;

	public void setOwner(PlayerDto owner) {
		this.owner = owner;
	}

	public PlayerDto getOwner() {
		return owner;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setCombatants(ZoneSlotDto[][] combatants) {
		this.combatants = combatants;
	}

	public ZoneSlotDto[][] getCombatants() {
		return combatants;
	}
}
