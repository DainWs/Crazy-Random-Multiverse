package com.dainws.games.crm.services;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.persistence.UserRepository;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;

@Service
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

	public void delete(UserCode userCode) throws UserNotFoundException {
		User user = this.findUser(userCode);
		if (this.partyService.isUserInParty(user)) {
			this.partyService.leaveParty(user);
		}

		this.userRepository.delete(userCode);
	}

	public User findUser(UserCode userCode) throws UserNotFoundException {
		return this.userRepository.find(userCode);
	}
}
