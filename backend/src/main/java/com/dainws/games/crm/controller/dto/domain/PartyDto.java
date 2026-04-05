package com.dainws.games.crm.controller.dto.domain;

import java.util.List;

public class PartyDto {
	private String code;
	private String name;
	private GameModeDto gameMode;
	private int userCount;
	private int maxUsers;
	private String owner;
	private List<String> users;
	
	public PartyDto() {
		this.maxUsers = 4;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}

	public void setGameMode(GameModeDto gameMode) {
		this.gameMode = gameMode;
	}
	
	public GameModeDto getGameMode() {
		return gameMode;
	}
	
	public void setUserCount(int userCount) {
		this.userCount = userCount;
	}
	
	public int getUserCount() {
		return userCount;
	}
	
	public void setMaxUsers(int maxUsers) {
		this.maxUsers = maxUsers;
	}
	
	public int getMaxUsers() {
		return maxUsers;
	}
	
	public void setOwner(String owner) {
		this.owner = owner;
	}
	
	public String getOwner() {
		return owner;
	}
	
	public void setUsers(List<String> users) {
		this.users = users;
	}
	
	public List<String> getUsers() {
		return users;
	}
}
