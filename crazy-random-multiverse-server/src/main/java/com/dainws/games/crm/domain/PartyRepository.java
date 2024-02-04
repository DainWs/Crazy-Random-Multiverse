package com.dainws.games.crm.domain;

import java.util.List;

import com.dainws.games.crm.domain.model.Party;
import com.dainws.games.crm.domain.model.PartyCode;
import com.dainws.games.crm.domain.model.User;
import com.dainws.games.crm.exception.PartyNotFoundException;

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
