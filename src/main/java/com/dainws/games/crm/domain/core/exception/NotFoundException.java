package com.dainws.games.crm.domain.core.exception;

public class NotFoundException extends GameRuntimeException {

	private static final long serialVersionUID = 1392950877789673225L;

	public NotFoundException(String whatNotFound) {
		super(new GameExceptionCode(whatNotFound+".not-found"));
	}
	
	public static NotFoundException gameNotFound() {
		return new NotFoundException("game");
	}
	
	public static NotFoundException playerNotFound() {
		return new NotFoundException("player");
	}
	
	public static NotFoundException cardNotFound() {
		return new NotFoundException("card");
	}
	
	public static NotFoundException zoneNotFound() {
		return new NotFoundException("zone");
	}
}
