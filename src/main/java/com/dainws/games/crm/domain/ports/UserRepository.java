package com.dainws.games.crm.domain.ports;

import com.dainws.games.crm.domain.exception.UserNotFoundException;
import com.dainws.games.crm.domain.models.User;
import com.dainws.games.crm.domain.models.UserCode;

public interface UserRepository {
	void save(User user);

	void delete(UserCode userCode);
	
	User find(UserCode userCode) throws UserNotFoundException;

	boolean has(UserCode userCode);
}
