package com.dainws.games.crm.console.services;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.console.domain.PartyRepository;
import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.domain.models.PartyCode;
import com.dainws.games.crm.console.domain.models.User;
import com.dainws.games.crm.console.domain.models.exceptions.PartyException;

@Service
public class PartyService {
	private PartyRepository partyRepository;
	
	public PartyService(PartyRepository partyRepository) {
		this.partyRepository = partyRepository;
	}
	
	public PartyCode create(User partyOwner) throws PartyException {
		Party party = new Party(partyOwner);
		this.partyRepository.saveParty(party);
		return party.getPartyCode();
	}
	
	public void join(PartyCode partyCode, User user) throws PartyException {
		this.getParty(partyCode).add(user);
	}
	
	public void leave(PartyCode partyCode, User user) throws PartyException {
		this.getParty(partyCode).remove(user);
	}
	
	public Party getParty(PartyCode partyCode) throws PartyException {
		return this.partyRepository.findParty(partyCode);
	}
}
