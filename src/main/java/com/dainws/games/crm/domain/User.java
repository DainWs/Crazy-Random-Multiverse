package com.dainws.games.crm.domain;

import java.util.Locale;
import java.util.Objects;

public class User {
	private String name;
	private Locale locale;
	private UserCode userCode;
	private UserPlatform platform;

	public User(String code, String name, UserPlatform platform) {
		this.name = name;
		this.locale = Locale.getDefault();
		this.userCode = UserCode.from(code);
		this.platform = platform;
	}

	public boolean isCode(UserCode code) {
		return this.userCode.equals(code);
	}

	public boolean isPlayingFrom(UserPlatform platform) {
		return this.platform.equals(platform);
	}

	public boolean isLocale(Locale locale) {
		return this.locale.equals(locale);
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

	public void setLocale(Locale locale) {
		this.locale = locale;
	}

	public Locale getLocale() {
		return locale;
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
