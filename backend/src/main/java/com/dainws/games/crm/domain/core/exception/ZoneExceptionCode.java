package com.dainws.games.crm.domain.core.exception;

public class ZoneExceptionCode extends ExceptionCode {

	public static final ExceptionCode COORDINATE_OUT_OF_BOUNDS = new ZoneExceptionCode("coordinate.out_of_bounds");
	public static final ExceptionCode COORDINATE_REQUIRES_LEADER = new ZoneExceptionCode("coordinate.requires_leader");
	public static final ExceptionCode PREVIOUS_ROW_NEEDS_TO_BE_FILLED = new ZoneExceptionCode("row.previous_need_to_be_filled");

	public ZoneExceptionCode(String value) {
		super("zone." + value);
	}

}
