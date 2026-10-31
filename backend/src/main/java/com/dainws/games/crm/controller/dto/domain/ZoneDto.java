package com.dainws.games.crm.controller.dto.domain;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public class ZoneDto {
	@NotNull
	private PlayerDto owner;

	@NotNull
	private String type;

	@Nullable
	private Double health;

	@Nullable
	private Double maxHealth;

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

	public Double getHealth() {
		return health;
	}

	public void setHealth(Double health) {
		this.health = health;
		if (health == 0) {
			this.health = null;
		}
	}

	public Double getMaxHealth() {
		return maxHealth;
	}

	public void setMaxHealth(Double maxHealth) {
		this.maxHealth = maxHealth;
		if (maxHealth == 0) {
			this.maxHealth = null;
		}
	}

	public void setCombatants(ZoneSlotDto[][] combatants) {
		this.combatants = combatants;
	}

	public ZoneSlotDto[][] getCombatants() {
		return combatants;
	}
}
