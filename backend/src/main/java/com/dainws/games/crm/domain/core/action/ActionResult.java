package com.dainws.games.crm.domain.core.action;

import java.util.Objects;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;

public class ActionResult {

	private final ExceptionCode exceptionCode;

	private ActionResult(ExceptionCode exceptionCode) {
		this.exceptionCode = exceptionCode;
	}

	public boolean isSuccessful() {
		return this.exceptionCode == null;
	}

	public ExceptionCode getExceptionCode() {
		return this.exceptionCode;
	}

	public static ActionResult successful() {
		return new ActionResult(null);
	}

	public static ActionResult failed(ExceptionCode exceptionCode) {
		Objects.requireNonNull(exceptionCode);
		return new ActionResult(exceptionCode);
	}
}
