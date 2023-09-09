package com.dainws.games.cbg.domain.card;

import java.util.Objects;

public abstract class Card {
	private CardCode code;
	private String name;
	private String description;

	protected Card(long code, String name, String description) {
		this.code = new CardCode(code, this.getType());
		this.name = name;
		this.description = description;
	}
	
	public final CardCode getCode() {
		return code;
	}

	public final String getName() {
		return name;
	}

	public final String getDescription() {
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
}
