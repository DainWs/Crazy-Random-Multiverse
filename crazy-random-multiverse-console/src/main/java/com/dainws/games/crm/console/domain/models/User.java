package com.dainws.games.crm.console.domain.models;

import java.util.Objects;

public class User {
	private UserCode userCode;

	private String name;

	public User(String name) {
		this.userCode = new UserCode();
		this.name = name;
	}

	public UserCode getUserCode() {
		return userCode;
	}

	public String getName() {
		return name;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		User that = (User) obj;
		return this.userCode.equals(that.userCode);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.userCode);
	}
}
