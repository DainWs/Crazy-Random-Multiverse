package com.dainws.games.crm.domain;

import java.util.List;


// TODO adapt this interface
public interface UserClient {
	static final UserClient NONE = new NoneUserClient();

	default void sendPartyInfo(Party party) {
		for (User user : party.getUsers()) {
			this.sendPartyInfo(user, party);
		}
	};

	void sendPartyInfo(User to, Party party);

	void sendPartyList(User to, List<Party> party);
}
