package com.dainws.games.crm.console.controllers.dto;

import com.dainws.games.cbg.domain.player.SquarePosition;

public class SquareDto {
	private SquarePosition squarePosition;
	private CombatantDto combatantDto;

	public SquareDto(SquarePosition squarePosition) {
		this.squarePosition = squarePosition;
	}
	
	public int getCellWidth() {
		int maxLength = 0;
		if (this.combatantDto != null) {
			maxLength = this.combatantDto.getCardWidth();
		}

		return maxLength;
	}
	
	public void setCombatantDto(CombatantDto combatantDto) {
		this.combatantDto = combatantDto;
	}
	
	public String getCombatantName() {
		if (this.combatantDto == null) {
			return "";
		}

		return this.combatantDto.getName();
	}
	
	public String getCombatantType() {
		if (this.combatantDto == null) {
			return "";
		}

		return this.combatantDto.getCardType();
	}
	
	public String getCombatantDescription() {
		if (this.combatantDto == null) {
			return "";
		}

		return this.combatantDto.getDescription();
	}
	
	public String getCombatantDamage() {
		if (this.combatantDto == null) {
			return "";
		}
		
		return this.combatantDto.getDamageAndDamageType();
	}
	
	public String getCombatantHealth() {
		if (this.combatantDto == null) {
			return "";
		}
		
		return this.combatantDto.getHealthAndMaxHealth();
	}
	
	public String getCombatantArmor() {
		if (this.combatantDto == null) {
			return "";
		}
		
		return this.combatantDto.getArmorAndArmorType();
	}
	
	public SquarePosition getSquarePosition() {
		return squarePosition;
	}
}
