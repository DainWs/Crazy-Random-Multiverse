package com.dainws.games.crm.console.controllers.dto;

public class WarriorDto extends CombatantDto {

	private String rarity;
	
	@Override
	public String getCardType() {
		return super.getCardType() + "[" + this.rarity + "]";
	}
	
	public void setRarity(String rarity) {
		this.rarity = rarity;
	}
	
	public String getRarity() {
		return rarity;
	}
}
