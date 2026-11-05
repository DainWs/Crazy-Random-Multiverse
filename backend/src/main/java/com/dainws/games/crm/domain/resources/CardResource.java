package com.dainws.games.crm.domain.resources;

import java.util.Objects;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

/**
 * What the client needs to show a card. The rarity is only set for warriors.
 */
public class CardResource {

	private static final String KEY_SEPARATOR = ".";

	private final CardCode code;
	private WarriorRarity rarity;
	private String name;
	private String description;

	public CardResource(CardCode code) {
		this.code = Objects.requireNonNull(code);
	}

	public CardCode getCode() {
		return this.code;
	}

	public CardType getType() {
		return this.code.type();
	}

	public boolean hasKey() {
		return this.code.isType(CardType.LEADER) //
				|| this.code.isType(CardType.WARRIOR) //
				|| this.code.isType(CardType.EQUIPMENT);
	}

	public String getKey() {
		if (this.code.isType(CardType.LEADER)) {
			return "leader" + KEY_SEPARATOR + this.code.codeText();
		}

		if (this.code.isType(CardType.WARRIOR)) {
			String rarityText = this.rarity.name().toLowerCase();
			return "warrior" + KEY_SEPARATOR + rarityText + KEY_SEPARATOR + this.code.codeText();
		}

		if (this.code.isType(CardType.EQUIPMENT)) {
			return "equipment" + KEY_SEPARATOR + this.code.codeText();
		}

		throw new IllegalStateException("A card of type " + this.getType() + " has no resources");
	}

	public WarriorRarity getRarity() {
		return this.rarity;
	}

	public void setRarity(WarriorRarity rarity) {
		this.rarity = rarity;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public static CardResource from(Card card) {
		CardResource resource = new CardResource(card.getCode());
		if (card instanceof Warrior warrior) {
			resource.setRarity(warrior.getRarity());
		}
		return resource;
	}
}
