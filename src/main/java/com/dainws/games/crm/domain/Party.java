package com.dainws.games.crm.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.exception.OperationNotAllowedException;

public class Party {
	private PartyCode partyCode;
	private UserCode ownerCode;
	private GameMode gameMode;
	private boolean isLocked;
	private Map<UserCode, User> users;

	public Party(User partyOwner) {
		this.partyCode = new PartyCode();
		this.ownerCode = partyOwner.getCode();
		this.gameMode = new GameMode("CLASSIC");
		this.users = new HashMap<>();
		this.users.put(partyOwner.getCode(), partyOwner);
	}
	
	public void changeMode(GameMode gameMode) {
		this.gameMode = gameMode;
	}

	public void add(User user) throws OperationNotAllowedException {
		if (this.isLocked) {
			throw new OperationNotAllowedException("party_locked");
		}

		this.users.put(user.getCode(), user);
	}

	public void remove(User user) throws OperationNotAllowedException {
		if (this.isLocked) {
			throw new OperationNotAllowedException("party_locked");
		}
		
		UserCode userCode = user.getCode();

		this.users.remove(userCode);

		if (this.ownerCode.equals(userCode) && this.users.size() > 0) {
			this.ownerCode = this.users.entrySet().iterator().next().getKey();
		}
	}
	
	public boolean has(User user) {
		return this.users.containsKey(user.getCode());
	}

	public User getOwner() {
		return this.users.get(this.ownerCode);
	}
	
	public GameMode getGameMode() {
		return gameMode;
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
}
