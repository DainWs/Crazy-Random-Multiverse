package com.dainws.games.cbg.domain.dealer.exception;

import com.dainws.games.cbg.domain.card.Card;

public class DuplicatedCardException extends RuntimeException {

	private static final long serialVersionUID = -3720478060560158883L;

	public DuplicatedCardException(Card card) {
		super("A "+card.getType()+" with code: " + card.getCode() + " already exists in this deck");
	}

}
