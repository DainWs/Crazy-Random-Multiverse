package com.dainws.games.crm.domain.core.exception;

public class ZoneExceptionCode extends ExceptionCode {

	public enum Code {
		COORDINATE_OUT_OF_BOUNDS("coordinate.out_of_bounds"),
		COORDINATE_REQUIRES_LEADER("coordinate.requires_leader"),
		PREVIOUS_ROW_NEEDS_TO_BE_FILLED("row.previous_need_to_be_filled");

		private final String text;

		Code(String text) {
			this.text = text;
		}

		public String text() {
			return text;
		}
	}

	public ZoneExceptionCode(Code code) {
		super("zone." + code.text());
	}

}
