package com.dainws.games.crm.domain.models.card;

import java.util.Objects;

import com.dainws.games.crm.domain.translator.Language;
import com.dainws.games.crm.domain.translator.Text;

public abstract class Card {
	private CardCode code;
	private Text name;
	private Text description;

	protected Card(long code, String name, String description) {
		this.code = new CardCode(code, this.getType());
		this.name = new Text("CARD_NAME", name, Language.UNKNOWN_LANGUAGE);
		this.description = new Text("CARD_DESCRIPTION", name, Language.UNKNOWN_LANGUAGE);
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
