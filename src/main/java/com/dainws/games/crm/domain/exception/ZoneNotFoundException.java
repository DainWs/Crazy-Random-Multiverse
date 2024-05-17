package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class ZoneNotFoundException extends GameRuntimeException {

	private static final long serialVersionUID = 4137826091865818613L;

	public ZoneNotFoundException() {
		super(new TranslatableKey("EXCEPTION_ZONE_NOT_FOUND"));
	}
}
