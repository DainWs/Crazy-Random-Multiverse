package com.dainws.games.crm.domain;

public interface UserClient {
	static final UserClient NONE = new NoneUserClient();

	default void sendPartyInfo(Party party) {
		for (User user : party.getUsers()) {
			this.sendPartyInfo(user, party);
		}
	};

	void sendPartyInfo(User to, Party party);
}
