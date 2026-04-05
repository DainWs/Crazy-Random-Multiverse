package com.dainws.games.crm.domain.repositories;

import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

public interface PartyRepository {
	void save(Party party);

	void delete(PartyCode partyCode);
	
	boolean has(PartyCode partyCode);
	
	boolean hasPartyWhereUserIsMember(User user);
	
	Party find(PartyCode partyCode) throws NotFoundException;
	
	Party findPartyWhereUserIsOwner(UserCode user) throws NotFoundException;
	
	Party findPartyWhereUserIsMember(UserCode user) throws NotFoundException;
	
	List<Party> findAll();
	
	List<Party> findPartiesInGame(GameCode code);
}
