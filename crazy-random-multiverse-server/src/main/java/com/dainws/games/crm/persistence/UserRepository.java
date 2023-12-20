package com.dainws.games.crm.persistence;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;

public interface UserRepository {
	void save(User user);

	void delete(UserCode userCode);
	
	User find(UserCode userCode) throws UserNotFoundException;

	boolean has(UserCode userCode);
}
