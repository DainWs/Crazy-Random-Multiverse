package com.dainws.games.crm.domain.repositories;

import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

public interface PartyRepository {
	void save(Party party);

	void delete(PartyCode partyCode);
	
	boolean has(PartyCode partyCode);
	
	boolean hasPartyWhereUserIsPresent(User user);
	
	Party find(PartyCode partyCode) throws NotFoundException;
	
	Party findPartyWhereUserIsOwner(User user) throws NotFoundException;
	
	Party findPartyWhereUserIsPresent(User user) throws NotFoundException;
	
	List<Party> findAll();
}
