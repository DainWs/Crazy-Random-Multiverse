package com.dainws.games.crm.persistence.repositories;

import com.dainws.games.crm.domain.models.User;
import com.dainws.games.crm.domain.models.UserCode;
import com.dainws.games.crm.persistence.exception.UserNotFoundException;

public interface UserRepository {
	void save(User user);

	void delete(UserCode userCode);
	
	User find(UserCode userCode) throws UserNotFoundException;

	boolean has(UserCode userCode);
}
