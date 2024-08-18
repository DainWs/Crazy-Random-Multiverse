package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

import com.dainws.games.crm.domain.translator.Text;

public abstract class Card {
	private CardCode code;
	private Text name;
	private Text description;

	protected Card(long code, String name, String description) {
		this.code = new CardCode(code, this.getType());
		
		String lowercaseType = this.getType().name().toLowerCase();
		String cardTextCode = "%s.%s".formatted(lowercaseType, code);
		String cardNameKey = "card_info.%s.name".formatted(cardTextCode);
		String cardDescriptionKey = "card_info.%s.description".formatted(cardTextCode);
		
		this.name = new Text(cardNameKey, name);
		this.description = new Text(cardDescriptionKey.formatted(cardTextCode), name);
	}

	public final CardCode getCode() {
		return code;
	}

	public final Text getName() {
		return name;
	}

	public final Text getDescription() {
		return description;
	}

	public abstract CardType getType();

	public boolean isType(CardType type) {
		return Objects.equals(this.getType(), type);
	}

	@Override
	public final boolean equals(Object obj) {
		if (obj == this) {
			return true;
		}

		if (obj == null || !(obj instanceof Card)) {
			return false;
		}

		Card that = (Card) obj;
		return this.code.equals(that.code);
	}

	@Override
	public final int hashCode() {
		return Objects.hash(this.code);
	}

	@Override
	public String toString() {
		return "%s".formatted(this.getName());
	}
}
