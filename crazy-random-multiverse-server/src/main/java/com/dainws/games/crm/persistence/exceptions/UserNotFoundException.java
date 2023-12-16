package com.dainws.games.crm.persistence.exceptions;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class UserNotFoundException extends RepositoryException {

	private static final long serialVersionUID = -5385095720163983511L;

	public UserNotFoundException() {
		super(new TranslatableKey("EXCEPTION_USER_NOT_FOUND"));
	}
}
