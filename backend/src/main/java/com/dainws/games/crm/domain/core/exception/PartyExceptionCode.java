package com.dainws.games.crm.domain.core.exception;

public class PartyExceptionCode extends ExceptionCode {

	public static final ExceptionCode LOCKED = new PartyExceptionCode("locked");
	public static final ExceptionCode IS_FULL = new PartyExceptionCode("is_full");
	public static final ExceptionCode DECK_WITHOUT_LEADER = new PartyExceptionCode("deck_without_leader");

	public PartyExceptionCode(String value) {
		super("party." + value);
	}

}
