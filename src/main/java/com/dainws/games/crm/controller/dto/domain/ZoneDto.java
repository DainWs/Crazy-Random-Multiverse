package com.dainws.games.crm.controller.dto.domain;

import jakarta.validation.constraints.NotNull;

public class ZoneDto {
	@NotNull
	private PlayerDto owner;
	
	@NotNull
	private Double health;
	
	@NotNull
	private Double maxHealth;
	
	@NotNull
	private CardDto[][] combatants;
	
	public void setOwner(PlayerDto owner) {
		this.owner = owner;
	}
	
	public PlayerDto getOwner() {
		return owner;
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
	
	public void setCombatants(CardDto[][] combatants) {
		this.combatants = combatants;
	}
	
	public CardDto[][] getCombatants() {
		return combatants;
	}
}
