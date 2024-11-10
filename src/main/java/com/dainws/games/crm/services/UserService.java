package com.dainws.games.crm.services;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.repositories.UserRepository;

public class UserService {
	private UserRepository userRepository;
	private PartyService partyService;

	public UserService(UserRepository userRepository, PartyService partyService) {
		this.userRepository = userRepository;
		this.partyService = partyService;
	}

	public void create(User user) {
		this.userRepository.save(user);
	}

	public void update(User user) {
		this.userRepository.save(user);
	}

	public User findUser(UserCode userCode) {
		return this.userRepository.find(userCode);
	}

	public void delete(UserCode userCode) {
		User user = this.findUser(userCode);
		this.partyService.tryLeaveParty(user);
		this.userRepository.delete(userCode);
	}
}
