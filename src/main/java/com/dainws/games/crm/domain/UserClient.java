package com.dainws.games.crm.domain;

import java.util.List;


// TODO adapt this interface
public interface UserClient {
	static final UserClient NONE = new UserClient() {};
	
	default void sendPartyInfo(User to, Party party) {};

	default void sendPartyList(User to, List<Party> party) {};
}
