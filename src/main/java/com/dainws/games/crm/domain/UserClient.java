package com.dainws.games.crm.domain;

import java.util.List;

public interface UserClient {
	static final UserClient NONE = new UserClient() {};
	
	default void sendPartyInfo(User to, Party party) {};

	default void sendPartyList(User to, List<Party> party) {};
}
