package com.dainws.games.crm.services;

import java.util.List;

import com.dainws.games.crm.domain.models.Party;
import com.dainws.games.crm.domain.models.User;

public interface UserClient {
	void sendPartyInfo(User to, Party party);

	void sendPartyList(User to, List<Party> party);
}