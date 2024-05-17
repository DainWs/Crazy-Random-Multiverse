package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class ActionException extends GameRuntimeException {

	private static final long serialVersionUID = 6403271344509017624L;

	public ActionException(String messageKey) {
		super(new TranslatableKey(messageKey));
	}

}
