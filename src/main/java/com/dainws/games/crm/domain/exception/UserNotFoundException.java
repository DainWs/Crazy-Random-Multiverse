package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class UserNotFoundException extends RepositoryException {

	private static final long serialVersionUID = -5385095720163983511L;

	public UserNotFoundException() {
		super(new TranslatableKey("EXCEPTION_USER_NOT_FOUND"));
	}
}
