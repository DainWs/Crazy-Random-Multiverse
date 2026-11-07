package com.dainws.games.crm.domain.core.action;

import java.util.Objects;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;

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

	public static ActionResult playerActionFailed(PlayerActionExceptionCode.Code code) {
		return failed(new PlayerActionExceptionCode(code));
	}
}
