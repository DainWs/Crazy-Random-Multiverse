package com.dainws.games.crm.stomp.dto.models;

public class PartyDto {
	private String code;
	private String name;
	private int userCount;
	private int maxUsers;
	
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
}
