package com.dainws.games.crm.domain.core.exception;

public class CoordinateOutOfBoundsException extends GameRuntimeException {

	private static final long serialVersionUID = -1313695002882278013L;

	public CoordinateOutOfBoundsException() {
		super(new GameExceptionCode("zone.coordinate.out_of_bounds"));
	}
}
