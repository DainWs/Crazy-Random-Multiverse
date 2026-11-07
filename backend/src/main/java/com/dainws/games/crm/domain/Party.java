package com.dainws.games.crm.domain;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PartyExceptionCode;

public class Party {
	private PartyCode partyCode;
	private UserCode ownerCode;
	private GameCode currentGame;
	private GameMode gameMode;
	private int maxUsers;
	private Map<UserCode, User> users;
	private Set<UserCode> pendingRemoval;

	public Party(User partyOwner, GameMode gameMode) {
		this(new PartyCode(), partyOwner, gameMode);
	}

	public Party(PartyCode code, User partyOwner, GameMode gameMode) {
		this.partyCode = code;
		this.ownerCode = partyOwner.getCode();
		this.currentGame = GameCode.NONE;
		this.gameMode = gameMode;
		this.users = new HashMap<>();
		this.pendingRemoval = new HashSet<>();
		this.users.put(partyOwner.getCode(), partyOwner);
		this.maxUsers = 5;
	}

	public boolean isCurrentGame(GameCode code) {
		if (this.currentGame == null) {
			return false;
		}

		return this.currentGame.equals(code);
	}

	public boolean isOwner(User user) {
		return this.isOwner(user.getCode());
	}
	
	public boolean isOwner(UserCode userCode) {
		return this.ownerCode.equals(userCode);
	}

	public void changeMode(GameMode gameMode) {
		this.gameMode = gameMode;
	}

	public void add(User user) throws NotAllowedException {
		if (this.isLocked()) {
			throw new NotAllowedException(PartyExceptionCode.LOCKED);
		}

		if (this.users.size() >= this.maxUsers) {
			throw new NotAllowedException(PartyExceptionCode.IS_FULL);
		}

		this.users.put(user.getCode(), user);
	}

	public void remove(User user) throws NotAllowedException {
		this.remove(user.getCode());
	}

	public void remove(UserCode userCode) throws NotAllowedException {
		if (this.isLocked()) {
			throw new NotAllowedException(PartyExceptionCode.LOCKED);
		}

		this.removeMember(userCode);
	}

	public void removeWhenUnlocked(UserCode userCode) {
		if (this.isLocked()) {
			this.pendingRemoval.add(userCode);
		} else {
			this.removeMember(userCode);
		}
	}

	private void removeMember(UserCode userCode) {
		this.users.remove(userCode);

		if (this.ownerCode.equals(userCode) && this.users.size() > 0) {
			this.ownerCode = this.users.entrySet().iterator().next().getKey();
		}
	}

	public boolean has(User user) {
		return this.has(user.getCode());
	}
	
	public boolean has(UserCode userCode) {
		return this.users.containsKey(userCode);
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

	public boolean isLocked() {		
		return !this.currentGame.isNone();
	}

	public boolean isCode(PartyCode partyCode) {
		return this.partyCode.equals(partyCode);
	}

	public PartyCode getCode() {
		return partyCode;
	}

	public String getCodeValue() {
		return partyCode.text();
	}

	public User getUser(UserCode userCode) {
		return this.users.get(userCode);
	}

	public List<User> getUsers() {
		return List.copyOf(this.users.values());
	}

	public void setCurrentGame(GameCode gameCode) {
		this.currentGame = gameCode;

		if (!this.isLocked()) {
			this.pendingRemoval.forEach(this::removeMember);
			this.pendingRemoval.clear();
		}
	}

	public GameCode getCurrentGame() {
		return currentGame;
	}

	public int getMaxUsers() {
		return maxUsers;
	}

	public void setMaxUsers(int maxUsers) {
		this.maxUsers = maxUsers;
	}

}
