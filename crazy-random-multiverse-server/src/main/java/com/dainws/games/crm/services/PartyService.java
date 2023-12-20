package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.communication.Destination;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.PartyException;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.persistence.PartyRepository;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;

@Service
public class PartyService {
	private PartyRepository partyRepository;
	private PartyChannel partyChannel;

	public PartyService(PartyRepository partyRepository, PartyChannel partyChannel) {
		this.partyRepository = partyRepository;
		this.partyChannel = partyChannel;
	}

	public void createParty(User partyOwner) throws PartyException {
		if (this.isUserInParty(partyOwner)) {
			throw new PartyException("USER_ALREADY_IN_PARTY");
		}

		Party party = new Party(partyOwner);
		this.partyRepository.save(party);
		
		this.sendPartyInfoTo(partyOwner.getCode(), party);
	}

	public void joinParty(PartyCode partyCode, User user) throws PartyException {
		if (this.isUserInParty(user)) {
			throw new PartyException("USER_ALREADY_IN_PARTY");
		}

		Party party = this.getParty(partyCode);
		party.add(user);

		this.sendPartyInfoTo(party.getUsers(), party);
	}

	public void leaveParty(User user) throws PartyException {
		if (!this.isUserInParty(user)) {
			throw new PartyException("USER_IS_NOT_AT_A_PARTY");
		}

		Party party = this.getPartyWhereUserIsPlayer(user);
		party.remove(user);
		
		this.sendPartyInfoTo(party.getUsers(), party);
		
		if (party.isEmpty()) {
			this.partyRepository.delete(party.getCode());
		}
	}

	public void lockParty(PartyCode partyCode) {
		this.lockParty(this.partyRepository.find(partyCode));
	}

	public void lockParty(Party party) {
		party.lock();
		this.partyRepository.save(party);
	}

	public void unlockParty(PartyCode partyCode) {
		this.lockParty(this.partyRepository.find(partyCode));
	}

	public void unlockParty(Party party) {
		party.unlock();
		this.partyRepository.save(party);
	}

	public Party getParty(PartyCode partyCode) {
		return this.partyRepository.find(partyCode);
	}

	public Party getPartyWhereUserIsOwner(User user) throws PartyNotFoundException {
		return this.getAllParties()
				.stream()
				.filter(party -> party.getOwner().equals(user))
				.findFirst()
				.orElseThrow(PartyNotFoundException::new);
	}
	
	public Party getPartyWhereUserIsPlayer(User user) throws PartyNotFoundException {
		return this.getAllParties()
				.stream()
				.filter(party -> party.has(user))
				.findFirst()
				.orElseThrow(PartyNotFoundException::new);
	}

	public List<Party> getAllParties() {
		return this.partyRepository.findAll();
	}

	public boolean isUserInParty(User user) {
		return this.getAllParties().stream().anyMatch(party -> party.has(user));
	}
	
	private void sendPartyInfoTo(List<User> users, Party party) {
		for (User user : users) {
			this.sendPartyInfoTo(user.getCode(), party);			
		}
	}
	
	private void sendPartyInfoTo(UserCode userCode, Party party) {
		this.partyChannel.sendPartyInfo(Destination.from(userCode.getValue()), party);
	}
}
