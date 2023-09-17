package com.dainws.games.crm.console.domain;

import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.domain.models.PartyCode;
import com.dainws.games.crm.console.domain.models.exceptions.PartyAlreadyExistException;
import com.dainws.games.crm.console.domain.models.exceptions.PartyNotFoundException;

public interface PartyRepository {

	void saveParty(Party party) throws PartyAlreadyExistException;

	Party findParty(PartyCode partyCode) throws PartyNotFoundException;

	boolean hasParty(PartyCode partyCode);
}
