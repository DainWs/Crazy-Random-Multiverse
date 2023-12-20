package com.dainws.games.crm.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.dainws.games.crm.game.GameMode;

public class Party {
	private PartyCode partyCode;
	private UserCode ownerCode;
	private GameMode gameMode;
	private boolean isLocked;
	private Map<UserCode, User> users;

	public Party(User partyOwner) {
		this.partyCode = new PartyCode();
		this.ownerCode = partyOwner.getCode();
		this.gameMode = GameMode.CLASSIC;
		this.users = new HashMap<>();
		this.users.put(partyOwner.getCode(), partyOwner);
	}

	public void add(User user) throws PartyException {
		if (this.isLocked) {
			throw new PartyException("EXCEPTION_PARTY_LOCKED");
		}

		this.users.put(user.getCode(), user);
	}

	public void remove(User user) throws PartyException {
		if (this.isLocked) {
			throw new PartyException("EXCEPTION_PARTY_LOCKED");
		}
		
		UserCode userCode = user.getCode();

		this.users.remove(userCode);

		System.out.println("is owner? " + this.ownerCode.equals(userCode));
		System.out.println("is not the last one? " + (this.users.size() > 0));
		if (this.ownerCode.equals(userCode) && this.users.size() > 0) {
			this.ownerCode = this.users.entrySet().iterator().next().getKey();
		}
	}
	
	public boolean has(User user) {
		return this.users.containsKey(user.getCode());
	}

	public User getOwner() {
		for (Entry<UserCode, User> entry : this.users.entrySet()) {
			System.out.println(entry.getKey() + " " + entry.getValue());
			
		}
		return this.users.get(this.ownerCode);
	}

	public void changeGameMode(GameMode gameMode) throws PartyException {
		if (this.isLocked) {
			throw new PartyException("EXCEPTION_PARTY_LOCKED");
		}

		this.gameMode = gameMode;
	}
	
	public boolean isEmpty() {
		return this.users.isEmpty();
	}
	
	public void lock() {
		this.isLocked = true;
	}
	
	public void unlock() {
		this.isLocked = false;
	}
	
	public boolean isLocked() {
		return isLocked;
	}

	public boolean hasPartyCode(PartyCode partyCode) {
		return this.partyCode.equals(partyCode);
	}

	public PartyCode getCode() {
		return partyCode;
	}
	
	public String getCodeValue() {
		return partyCode.getValue();
	}

	public List<User> getUsers() {
		return List.copyOf(this.users.values());
	}

	public GameMode getGameMode() {
		return this.gameMode;
	}
}
