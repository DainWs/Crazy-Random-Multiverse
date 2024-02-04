package com.dainws.games.crm.domain;

import java.util.List;

import com.dainws.games.crm.domain.model.Party;
import com.dainws.games.crm.domain.model.User;

// TODO debido a esto, tal vez haya que mover User y Party al dominio
public interface PartyPublisher {
	void sendPartyInfo(User to, Party party);

	void sendPartyList(User to, List<Party> party);
}
