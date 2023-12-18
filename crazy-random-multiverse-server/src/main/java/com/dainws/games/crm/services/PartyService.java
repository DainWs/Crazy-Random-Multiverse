package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.persistence.PartyRepository;
import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.persistence.entity.PartyCode;
import com.dainws.games.crm.persistence.entity.User;
import com.dainws.games.crm.persistence.exceptions.PartyException;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;

@Service
public class PartyService {
	private PartyRepository partyRepository;

	public PartyService(PartyRepository partyRepository) {
		this.partyRepository = partyRepository;
	}

	public Party createParty(User partyOwner) throws PartyException {
		if (this.isUserInParty(partyOwner)) {
			throw new PartyException("USER_ALREADY_IN_PARTY");
		}

		Party party = new Party(partyOwner);
		this.partyRepository.save(party);
		return party;
	}

	public void joinParty(PartyCode partyCode, User user) throws PartyException {
		if (this.isUserInParty(user)) {
			throw new PartyException("USER_ALREADY_IN_PARTY");
		}

		this.getParty(partyCode).add(user);
	}

	public void leaveParty(PartyCode partyCode, User user) throws PartyException {
		if (!this.isUserInParty(user)) {
			throw new PartyException("USER_IS_NOT_AT_A_PARTY");
		}

		this.getParty(partyCode).remove(user);
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

	private boolean isUserInParty(User user) {
		return this.getAllParties().stream().anyMatch(party -> party.has(user));
	}
}
