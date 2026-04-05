package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

public abstract class Card {
	private CardCode code;

	protected Card(long code) {
		this.code = new CardCode(code, this.getType());
	}

	public final CardCode getCode() {
		return code;
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
		return this.code.toString();
	}
}
