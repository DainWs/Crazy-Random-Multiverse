package com.dainws.games.crm.console.domain.models;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Party {
	private PartyCode partyCode;
	private GameMode gameMode;
	private Map<UserCode, User> users;

	public Party(User partyOwner) {
		this.partyCode = new PartyCode();
		this.gameMode = GameMode.CLASSIC;
		this.users = new HashMap<>();
		this.users.put(partyOwner.getUserCode(), partyOwner);
	}

	public void add(User user) {
		UserCode userCode = user.getUserCode();
		if (this.users.containsKey(userCode)) {
			throw new IllegalStateException("Este usuario ya se encuentra en esta Party");
		}

		this.users.put(userCode, user);
	}

	public void remove(User user) {
		UserCode userCode = user.getUserCode();
		if (!this.users.containsKey(userCode)) {
			throw new IllegalStateException("Este usuario no se encuentra en esta Party");
		}

		this.users.remove(userCode);
	}

	public void changeGameMode(GameMode gameMode) {
		this.gameMode = gameMode;
	}

	public boolean hasPartyCode(PartyCode partyCode) {
		return this.partyCode.equals(partyCode);
	}

	public PartyCode getPartyCode() {
		return partyCode;
	}

	public List<User> getUsers() {
		return List.copyOf(this.users.values());
	}

	public GameMode getGameMode() {
		return this.gameMode;
	}
}
