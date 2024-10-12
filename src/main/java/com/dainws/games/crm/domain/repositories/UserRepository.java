package com.dainws.games.crm.domain.repositories;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

public interface UserRepository {
	void save(User user);

	void delete(UserCode userCode);
	
	User find(UserCode userCode) throws NotFoundException;

	boolean has(UserCode userCode);
}
