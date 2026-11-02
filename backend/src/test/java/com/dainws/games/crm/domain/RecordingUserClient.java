package com.dainws.games.crm.domain;

import java.util.ArrayList;
import java.util.List;

public class RecordingUserClient implements UserClient {

	private final List<User> recipients;
	private final List<Party> sentParties;

	public RecordingUserClient() {
		this.recipients = new ArrayList<>();
		this.sentParties = new ArrayList<>();
	}

	@Override
	public void sendPartyInfo(User to, Party party) {
		this.recipients.add(to);
		this.sentParties.add(party);
	}

	public List<User> getRecipients() {
		return List.copyOf(this.recipients);
	}

	public List<Party> getSentParties() {
		return List.copyOf(this.sentParties);
	}
}
