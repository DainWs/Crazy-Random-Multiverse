package com.dainws.games.crm.persistence.repositories;

import java.util.List;

import com.dainws.games.crm.domain.exception.PartyNotFoundException;
import com.dainws.games.crm.domain.models.Party;
import com.dainws.games.crm.domain.models.PartyCode;
import com.dainws.games.crm.domain.models.User;

public interface PartyRepository {
	void save(Party party);

	void delete(PartyCode partyCode);
	
	boolean has(PartyCode partyCode);
	
	boolean hasPartyWhereUserIsPresent(User user);
	
	Party find(PartyCode partyCode) throws PartyNotFoundException;
	
	Party findPartyWhereUserIsOwner(User user) throws PartyNotFoundException;
	
	Party findPartyWhereUserIsPresent(User user) throws PartyNotFoundException;
	
	List<Party> findAll();
}