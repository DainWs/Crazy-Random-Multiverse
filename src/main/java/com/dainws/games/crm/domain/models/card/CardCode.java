package com.dainws.games.crm.domain.models.card;

import java.util.Objects;

public final class CardCode {
	private long code;
	private CardType type;

	public CardCode(long code, CardType type) {
		this.code = code;
		this.type = type;
	}

	public long getCode() {
		return this.code;
	}
	
	public CardType getType() {
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
		return "%s#%s".formatted(this.type, this.code);
	}
}
