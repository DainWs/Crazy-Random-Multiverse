package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.model.User;
import com.dainws.games.crm.domain.model.UserCode;
import com.dainws.games.crm.exception.UserNotFoundException;

public interface UserRepository {
	void save(User user);

	void delete(UserCode userCode);
	
	User find(UserCode userCode) throws UserNotFoundException;

	boolean has(UserCode userCode);
}
