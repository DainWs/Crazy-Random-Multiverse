package com.dainws.games.crm.persistence;

import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;

public interface PartyRepository {
	void save(Party party);

	void delete(PartyCode partyCode);
	
	boolean has(PartyCode partyCode);
	
	Party find(PartyCode partyCode) throws PartyNotFoundException;
	
	List<Party> findAll();
}
