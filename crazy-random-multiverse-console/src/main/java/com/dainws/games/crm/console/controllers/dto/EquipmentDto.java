package com.dainws.games.crm.console.controllers.dto;

public class EquipmentDto extends CardDto {
	private String damage;
	private String health;
	private String armor;

	@Override
	public int getCardWidth() {
		int maxLength = super.getCardWidth();
		
		if (this.getDamageDescriptor().length() > maxLength) {
			maxLength = this.getDamageDescriptor().length();
		}
		
		if (this.getHealthDescriptor().length() > maxLength) {
			maxLength = this.getHealthDescriptor().length();
		}
		
		if (this.getArmorDescriptor().length() > maxLength) {
			maxLength = this.getArmorDescriptor().length();
		}
		
		return maxLength;
	}

	public void setDamage(String damage) {
		this.damage = damage;
	}
	
	public String getDamage() {
		return damage;
	}
	
	public String getDamageDescriptor() {
		return "ATK: " + this.damage;
	}
	
	public void setHealth(String health) {
		this.health = health;
	}
	
	public String getHealth() {
		return health;
	}
	
	public String getHealthDescriptor() {
		return "PV: " +health;
	}
	
	public void setArmor(String armor) {
		this.armor = armor;
	}
	
	public String getArmor() {
		return armor;
	}

	public String getArmorDescriptor() {
		return "DEF: " +armor;
	}

	@Override
	public String toString(String cardBorder) {
		int cardWith = this.getCardWidth();
		int sides = 2;
		String dataWildcard = cardBorder+" %-"+cardWith+"s "+cardBorder;
		String horizontalBorder = cardBorder.repeat(cardWith + sides + cardBorder.length() * sides);
		String empty = dataWildcard.formatted(" ");

		return new StringBuilder()
			.append(horizontalBorder).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.getName())).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.getCardType())).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.getDamageDescriptor())).append("\n")
			.append(dataWildcard.formatted(this.getHealthDescriptor())).append("\n")
			.append(dataWildcard.formatted(this.getArmorDescriptor())).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.getDescription())).append("\n")
			.append(empty).append("\n")
			.append(horizontalBorder).append("\n")
			.toString();
	}
}
