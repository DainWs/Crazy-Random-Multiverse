package com.dainws.games.crm.console.controllers.dto;

public class CombatantDto extends CardDto {
	private String health;
	private String maxHealth;

	private String damage;
	private String damageType;
	
	private String armor;
	private String armorType;
	
	@Override
	public int getCardWidth() {
		int maxLength = super.getCardWidth();
		if (this.getDamageAndDamageType().length() > maxLength) {
			maxLength = this.getDamageAndDamageType().length();
		}

		if (this.getHealthAndMaxHealth().length() > maxLength) {
			maxLength = this.getHealthAndMaxHealth().length();
		}

		if (this.getArmorAndArmorType().length() > maxLength) {
			maxLength = this.getArmorAndArmorType().length();
		}
		
		return maxLength;
	}
	
	public String getDamageAndDamageType() {
		return "ATK: "+this.damage + "/" + this.damageType;
	}
	
	public String getHealthAndMaxHealth() {
		return "PV: "+this.health + "/" + this.maxHealth;
	}
	
	public String getArmorAndArmorType() {
		return "DEF: "+this.armor + "/" + this.armorType;
	}

	public void setHealth(String health) {
		this.health = health;
	}
	
	public String getHealth() {
		return health;
	}
	
	public void setMaxHealth(String maxHealth) {
		this.maxHealth = maxHealth;
	}
	
	public String getMaxHealth() {
		return maxHealth;
	}
	
	public void setDamage(String damage) {
		this.damage = damage;
	}
	
	public String getDamage() {
		return damage;
	}
	
	public void setDamageType(String damageType) {
		this.damageType = damageType;
	}
	
	public String getDamageType() {
		return damageType;
	}
	
	public void setArmor(String armor) {
		this.armor = armor;
	}
	
	public String getArmor() {
		return armor;
	}
	
	public void setArmorType(String armorType) {
		this.armorType = armorType;
	}
	
	public String getArmorType() {
		return armorType;
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
			.append(dataWildcard.formatted(this.getDamageAndDamageType())).append("\n")
			.append(dataWildcard.formatted(this.getHealthAndMaxHealth())).append("\n")
			.append(dataWildcard.formatted(this.getArmorAndArmorType())).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.getDescription())).append("\n")
			.append(empty).append("\n")
			.append(horizontalBorder).append("\n")
			.toString();
	}
}
