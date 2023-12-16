package com.dainws.games.crm.persistence.exceptions;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class PartyNotFoundException extends RepositoryException {

	private static final long serialVersionUID = 7115078354015887872L;

	public PartyNotFoundException() {
		super(new TranslatableKey("EXCEPTION_PARTY_NOT_FOUND"));
	}
}
