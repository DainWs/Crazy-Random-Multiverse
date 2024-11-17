package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.repositories.UserRepository;

@Service
public class UserService {

	private UserRepository userRepository;
	private PartyService partyService;
	
	public UserService(UserRepository userRepository, PartyService partyService) {
		this.userRepository = userRepository;
		this.partyService = partyService;
	}
	
	public List<Party> getParties() {
		return this.partyService.getParties();
	}
	
	public void createParty(User partyOwner, Party party) {
		this.partyService.createParty(partyOwner, party);
	}
	
	public Party joinParty(PartyCode partyCode, User user) {
		return this.partyService.joinParty(partyCode, user);
	}
	
	public void create(User user) {
		this.userRepository.save(user);
	}
	
	public void update(User user) {
		this.userRepository.save(user);
	}
	
	public void delete(UserCode userCode) {
		User user = this.userRepository.find(userCode);
		this.partyService.leaveParty(user);
		this.userRepository.delete(userCode);
	}
}
