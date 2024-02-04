package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.PartyPublisher;
import com.dainws.games.crm.domain.PartyRepository;
import com.dainws.games.crm.domain.model.Party;
import com.dainws.games.crm.domain.model.PartyCode;
import com.dainws.games.crm.domain.model.User;
import com.dainws.games.crm.exception.PartyException;
import com.dainws.games.crm.exception.PartyNotFoundException;

@Service
public class PartyService {
	private PartyRepository partyRepository;
	private PartyPublisher partyPublisher;

	public PartyService(PartyRepository partyRepository, PartyPublisher partyPublisher) {
		this.partyRepository = partyRepository;
		this.partyPublisher = partyPublisher;
	}

	public void createParty(User partyOwner) throws PartyException {
		if (this.partyRepository.hasPartyWhereUserIsPresent(partyOwner)) {
			throw new PartyException("USER_ALREADY_IN_PARTY");
		}

		Party party = new Party(partyOwner);
		this.partyRepository.save(party);
		
		this.sendPartyInfoTo(partyOwner, party);
	}

	public void joinParty(PartyCode partyCode, User user) throws PartyException {
		if (this.partyRepository.hasPartyWhereUserIsPresent(user)) {
			throw new PartyException("USER_ALREADY_IN_PARTY");
		}

		Party party = this.partyRepository.find(partyCode);
		party.add(user);

		this.sendPartyInfoTo(party.getUsers(), party);
	}

	public void leaveParty(User user) throws PartyNotFoundException {
		Party party = this.partyRepository.findPartyWhereUserIsPresent(user);
		party.remove(user);
		
		this.sendPartyInfoTo(party.getUsers(), party);
		
		if (party.isEmpty()) {
			this.partyRepository.delete(party.getCode());
		}
	}
	
	public void tryLeaveParty(User user) {
		if (this.partyRepository.hasPartyWhereUserIsPresent(user)) {
			this.leaveParty(user);
		}
	}
	
	public void updatePartyListOf(User user) {
		List<Party> parties = this.partyRepository.findAll();
		this.partyPublisher.sendPartyList(user, parties);
	}

	public void lockParty(Party party) {
		party.lock();
		this.partyRepository.save(party);
	}

	public void unlockParty(Party party) {
		party.unlock();
		this.partyRepository.save(party);
	}
	
	private void sendPartyInfoTo(List<User> users, Party party) {
		for (User user : users) {
			this.sendPartyInfoTo(user, party);			
		}
	}
	
	private void sendPartyInfoTo(User user, Party party) {
		this.partyPublisher.sendPartyInfo(user, party);
	}
}
