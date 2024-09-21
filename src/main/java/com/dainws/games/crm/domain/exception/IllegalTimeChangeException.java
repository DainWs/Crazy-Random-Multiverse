package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class IllegalTimeChangeException extends GameRuntimeException {

	private static final long serialVersionUID = -1636374431906201271L;

	public IllegalTimeChangeException() {
		super(new TranslatableKey("TIME_CHANGE_ONLY_ALLOWED_ON_INPROGRESS_STATE"));
	}

}
