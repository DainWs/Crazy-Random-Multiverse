package com.dainws.games.crm.services;

import java.util.List;

import com.dainws.games.cbg.domain.communication.Destination;
import com.dainws.games.crm.domain.Party;

// TODO debido a esto, tal vez haya que mover User y Party al dominio
public interface PartyChannel {
	void sendPartyInfo(Destination destination, Party party);

	void sendPartyList(Destination destination, List<Party> party);
}
