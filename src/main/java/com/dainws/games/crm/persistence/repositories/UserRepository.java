package com.dainws.games.crm.persistence.repositories;

import com.dainws.games.crm.domain.core.User;
import com.dainws.games.crm.domain.core.UserCode;
import com.dainws.games.crm.domain.exception.UserNotFoundException;

public interface UserRepository {
	void save(User user);

	void delete(UserCode userCode);
	
	User find(UserCode userCode) throws UserNotFoundException;

	boolean has(UserCode userCode);
}
