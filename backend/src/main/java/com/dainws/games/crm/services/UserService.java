package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.repositories.UserRepository;
import com.dainws.games.crm.usecase.dto.CreatePartyRequest;

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
	
	public Party createParty(User partyOwner, CreatePartyRequest request) {
		GameMode gameMode = request.getGameMode().getDomainGameMode();

		Party party = new Party(partyOwner, gameMode);
		party.setMaxUsers(request.getMaxPlayers());

		return this.partyService.createParty(party);
	}
	
	public Party joinParty(PartyCode partyCode, User user) {
		return this.partyService.joinParty(partyCode, user);
	}
	
	public boolean exists(UserCode code) {
		return this.userRepository.has(code);
	}

	public User get(UserCode code) {
		return this.userRepository.find(code);
	}
	
	public void create(User user) {
		this.userRepository.save(user);
	}
	
	public void update(User user) {
		this.userRepository.save(user);
	}
	
	public void deleteDisconnectedUsers() {
		for (User user : this.userRepository.findAll()) {
			if (!user.isConnected()) {
				this.delete(user.getCode());
			}
		}
	}

	public void delete(UserCode userCode) {
		User user = this.userRepository.find(userCode);
		this.partyService.leaveParty(user);
		this.userRepository.delete(userCode);
	}
}
