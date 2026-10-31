package com.dainws.games.crm.controller.dto.domain;

import com.dainws.games.crm.domain.core.card.CardType;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public class ZoneSlotDto {
	@NotNull
	@JsonProperty("allowedCombatant")
	private CardType allowedCombatant;

	@Nullable
	@JsonProperty("combatant")
	private CardDto combatant;

	public CardType getAllowedCombatant() {
		return allowedCombatant;
	}

	public void setAllowedCombatant(CardType allowedCombatant) {
		this.allowedCombatant = allowedCombatant;
	}

	public CardDto getCombatant() {
		return combatant;
	}

	public void setCombatant(CardDto combatant) {
		this.combatant = combatant;
	}
}
