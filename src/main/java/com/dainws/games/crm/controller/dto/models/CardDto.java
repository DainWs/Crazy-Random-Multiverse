package com.dainws.games.crm.controller.dto.models;

import com.dainws.games.crm.domain.models.card.CardType;
import com.dainws.games.crm.domain.models.card.WarriorRarity;
import com.dainws.games.crm.domain.models.card.statistics.ArmorType;
import com.dainws.games.crm.domain.models.card.statistics.DamageType;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CardDto {
	@NotNull
	@JsonProperty("code")
	private CardCodeDto code;

	// TODO deberia traducirse name y description no?
	@NotBlank
	@JsonProperty("name")
	private String nameKey;

	@NotBlank
	@JsonProperty("description")
	private String descriptionKey;

	@NotBlank
	@JsonProperty("type")
	private CardType type;

	@JsonProperty("rarity")
	private WarriorRarity rarity;

	@JsonProperty("damage")
	private Double damage;

	@JsonProperty("damageType")
	private DamageType damageType;

	@JsonProperty("armor")
	private Double armor;

	@JsonProperty("armorType")
	private ArmorType armorType;

	@JsonProperty("health")
	private Double health;

	@JsonProperty("maxHealth")
	private Double maxHealth;

	public CardCodeDto getCode() {
		return code;
	}

	public void setCode(CardCodeDto code) {
		this.code = code;
	}

	public String getNameKey() {
		return nameKey;
	}

	public void setNameKey(String nameKey) {
		this.nameKey = nameKey;
	}

	public String getDescriptionKey() {
		return descriptionKey;
	}

	public void setDescriptionKey(String descriptionKey) {
		this.descriptionKey = descriptionKey;
	}

	public CardType getType() {
		return type;
	}

	public void setType(CardType type) {
		this.type = type;
	}

	public WarriorRarity getRarity() {
		return rarity;
	}

	public void setRarity(WarriorRarity rarity) {
		this.rarity = rarity;
	}

	public Double getDamage() {
		return damage;
	}

	public void setDamage(Double damage) {
		this.damage = damage;
		if (damage == 0) {
			this.damage = null;
		}
	}

	public DamageType getDamageType() {
		return damageType;
	}

	public void setDamageType(DamageType damageType) {
		this.damageType = damageType;
	}

	public Double getArmor() {
		return armor;
	}

	public void setArmor(Double armor) {
		this.armor = armor;
		if (armor == 0) {
			this.armor = null;
		}
	}

	public ArmorType getArmorType() {
		return armorType;
	}

	public void setArmorType(ArmorType armorType) {
		this.armorType = armorType;
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
}
