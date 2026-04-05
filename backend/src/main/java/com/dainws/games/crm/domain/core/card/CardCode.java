package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

public final class CardCode {
	private long code;
	private CardType type;

	public CardCode(long code, CardType type) {
		this.code = code;
		this.type = type;
	}

	public long code() {
		return this.code;
	}
	
	public CardType type() {
		return type;
	}
	
	public boolean isType(CardType cardType) {
		return this.type.equals(cardType);
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		CardCode that = (CardCode) obj;
		boolean isCodeEquals = this.code == that.code;
		boolean isTypeEquals = this.type.equals(that.type);
		return isCodeEquals && isTypeEquals;
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.code, this.type);
	}

	@Override
	public String toString() {
		String typeLowercase = this.type.name().toLowerCase();
		return "%s.%s".formatted(typeLowercase, this.code);
	}
}
