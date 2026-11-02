package com.dainws.games.crm.controller;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;

public class RequestExceptionCode extends ExceptionCode {

	public enum Code {
		MALFORMED("malformed");

		private final String text;

		Code(String text) {
			this.text = text;
		}

		public String text() {
			return text;
		}
	}

	public RequestExceptionCode(Code code) {
		super("request." + code.text());
	}

}
