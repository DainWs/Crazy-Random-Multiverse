package com.dainws.games.crm.console.domain.models.exceptions;

public class PartyException extends Exception {

	private static final long serialVersionUID = 4771549628323658408L;

	public PartyException(String message) {
		super(message);
	}
	
	public PartyException(Throwable throwable) {
		super(throwable);
	}
	
	public PartyException(String message, Throwable throwable) {
		super(message, throwable);
	}
}
