package com.dainws.games.crm.console.domain.models.exceptions;

import com.dainws.games.crm.console.domain.models.PartyCode;

public class PartyNotFoundException extends PartyException {

	private static final long serialVersionUID = 7115078354015887872L;

	public PartyNotFoundException(PartyCode partyCode) {
		super("No se pudo encontrar una Party con el codigo " + partyCode);
	}
}
