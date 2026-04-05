package com.dainws.games.crm.services.exception;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;

public class PartyException extends UsecaseException {

	private static final long serialVersionUID = -5393756350891178006L;

	public PartyException(String messageId) {
		this(new ExceptionCode("party." + messageId));
	}
	
	public PartyException(ExceptionCode code) {
		super(code);
	}
	
	public PartyException(ExceptionCode code, Throwable throwable) {
		super(code, throwable);
	}

	public static PartyException partyNotFound() {
		return new PartyException("not_found");
	}
	
	public static PartyException userIsNotPartyOwner() {
		return new PartyException("user_is_not_party_owner");
	}

	public static PartyException userAlreadyInParty() {
		return new PartyException("user_already_in_party");
	}
}
