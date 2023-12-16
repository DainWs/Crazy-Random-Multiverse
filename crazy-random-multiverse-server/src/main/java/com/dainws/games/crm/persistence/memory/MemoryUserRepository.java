package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.persistence.UserRepository;
import com.dainws.games.crm.persistence.entity.User;
import com.dainws.games.crm.persistence.entity.UserCode;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;

public class MemoryUserRepository implements UserRepository {

	private Map<UserCode, User> users;
	private Logger logger;

	public MemoryUserRepository() {
		this.users = new HashMap<>();
		this.logger = LoggerFactory.getLogger(MemoryUserRepository.class.getCanonicalName());
	}

	@Override
	public void save(User user) {
		this.logger.info("Guardando User con nombre {}", user.getName());
		this.users.put(user.getCode(), user);
	}

	@Override
	public void delete(UserCode userCode) {
		User user = this.users.get(userCode);
		this.logger.info("Borrando usuario con nombre {}", user.getName());
		this.users.remove(userCode);
	}

	@Override
	public User find(UserCode userCode) throws UserNotFoundException {
		if (this.has(userCode)) {
			return this.users.get(userCode);
		}

		throw new UserNotFoundException();
	}

	@Override
	public boolean has(UserCode userCode) {
		return this.users.containsKey(userCode);
	}

}
