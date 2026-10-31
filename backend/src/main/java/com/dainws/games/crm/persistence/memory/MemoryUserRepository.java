package com.dainws.games.crm.persistence.memory;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.repositories.UserRepository;

public class MemoryUserRepository implements UserRepository {

	private Map<UserCode, User> users;
	private Logger logger;

	public MemoryUserRepository() {
		this.users = new ConcurrentHashMap<>();
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
	public User find(UserCode userCode) throws NotFoundException {
		if (this.has(userCode)) {
			return this.users.get(userCode);
		}

		throw new NotFoundException("user");
	}

	@Override
	public List<User> findAll() {
		return List.copyOf(this.users.values());
	}

	@Override
	public boolean has(UserCode userCode) {
		return userCode != null && this.users.containsKey(userCode);
	}

}
