package com.dainws.games.crm.domain;

import java.security.Principal;
import java.util.Objects;

public class User implements Principal {
	private UserCode userCode;
	private UserPlatform platform;
	private String name;

	public User(String code, String name, UserPlatform platform) {
		this.userCode = UserCode.fromString(code);
		this.platform = platform;
		this.name = name;
	}

	public boolean isPlayingFrom(UserPlatform platform) {
		return this.platform.equals(platform);
	}

	public UserPlatform getPlatform() {
		return platform;
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
