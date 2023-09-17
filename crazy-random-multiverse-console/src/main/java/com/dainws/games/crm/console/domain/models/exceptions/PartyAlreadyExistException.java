package com.dainws.games.crm.console.domain.models.exceptions;

import com.dainws.games.crm.console.domain.models.PartyCode;

public class PartyAlreadyExistException extends PartyException {

	private static final long serialVersionUID = -4918807683458128252L;

	public PartyAlreadyExistException(PartyCode partyCode) {
		super("La Party con codigo " + partyCode + " ya existe");
	}
}
