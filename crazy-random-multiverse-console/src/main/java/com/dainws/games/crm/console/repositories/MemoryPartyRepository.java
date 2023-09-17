package com.dainws.games.crm.console.repositories;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.dainws.games.crm.console.domain.PartyRepository;
import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.domain.models.PartyCode;
import com.dainws.games.crm.console.domain.models.exceptions.PartyAlreadyExistException;
import com.dainws.games.crm.console.domain.models.exceptions.PartyNotFoundException;

@Repository
public class MemoryPartyRepository implements PartyRepository {

	private Map<PartyCode, Party> partys;
	
	public MemoryPartyRepository() {
		this.partys = new HashMap<>();
	}
	
	@Override
	public void saveParty(Party party)  throws PartyAlreadyExistException {
		PartyCode partyCode = party.getPartyCode();
		
		if (this.hasParty(partyCode)) {
			throw new PartyAlreadyExistException(partyCode);
		}
		
		this.partys.put(partyCode, party);
	}

	@Override
	public Party findParty(PartyCode partyCode) throws PartyNotFoundException {
		if (!this.hasParty(partyCode)) {
			throw new PartyNotFoundException(partyCode);
		}

		return this.partys.get(partyCode);
	}
	
	@Override
	public boolean hasParty(PartyCode partyCode) {
		return this.partys.containsKey(partyCode);
	}

}