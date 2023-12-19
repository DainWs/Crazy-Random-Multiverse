package com.dainws.games.crm.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.persistence.UserRepository;
import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.persistence.entity.PartyCode;
import com.dainws.games.crm.persistence.entity.User;
import com.dainws.games.crm.persistence.entity.UserCode;
import com.dainws.games.crm.persistence.exceptions.PartyException;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;

@Service
public class UserService {
	private PartyService partyService;
	private UserRepository userRepository;
	private Logger logger;

	public UserService(UserRepository userRepository, PartyService partyService) {
		this.userRepository = userRepository;
		this.partyService = partyService;
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void create(User user) {
		this.userRepository.save(user);
	}

	public void update(User user) {
		this.userRepository.save(user);
	}

	public void delete(UserCode userCode) throws UserNotFoundException {
		this.userRepository.delete(userCode);
	}

	public User findUser(UserCode userCode) throws UserNotFoundException {
		return this.userRepository.find(userCode);
	}

	public void createParty(User partyOwner) throws PartyException {
		this.partyService.createParty(partyOwner);
		this.logger.debug("El usuario {}, ha creado una fiesta", partyOwner.getName());
	}

	public void joinParty(PartyCode partyCode, User user) throws PartyException, PartyNotFoundException {
		this.partyService.joinParty(partyCode, user);
		this.logger.debug("El usuario {}, se ha unido a la fiesta {}", user.getName(), partyCode);
	}

	public void leaveParty(User user) throws PartyException, PartyNotFoundException {
		Party party = this.partyService.getPartyWhereUserIsPlayer(user);
		this.partyService.leaveParty(party.getCode(), user);
		this.logger.debug("El usuario {}, ha salido de la fiesta {}", user.getName(), party.getCode());
	}

	public Party getPartyOfUser(User user) {
		return this.partyService.getPartyWhereUserIsPlayer(user);
	}
	
	public List<Party> getAllParties() {
		return this.partyService.getAllParties();
	}
}
