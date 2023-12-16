package com.dainws.games.crm.persistence.entity;

import java.security.Principal;
import java.util.Objects;

public class User implements Principal {
	private UserCode userCode;

	private String name;

	public User(String code, String name) {
		this.userCode = UserCode.fromString(code);
		this.name = name;
	}

	public UserCode getCode() {
		return userCode;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	@Override
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
