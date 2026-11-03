package com.dainws.games.crm.domain;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

public class User {
	private String name;
	private Locale locale;
	private final Set<String> socketIds;
	private Instant withoutSocketSince;
	private UserCode userCode;
	private UserPlatform platform;

	public User(String code, String name, UserPlatform platform) {
		this.name = name;
		this.locale = Locale.getDefault();
		this.socketIds = new HashSet<>();
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

	public synchronized void bindSocket(String socketId) {
		this.socketIds.add(socketId);
		this.withoutSocketSince = null;
	}

	public synchronized void unbindSocket(String socketId, Instant now) {
		this.socketIds.remove(socketId);
		this.startWaitingForSocket(now);
	}

	public synchronized void startWaitingForSocket(Instant now) {
		if (this.socketIds.isEmpty() && this.withoutSocketSince == null) {
			this.withoutSocketSince = now;
		}
	}

	public synchronized boolean isConnected() {
		return !this.socketIds.isEmpty();
	}

	public synchronized boolean hasBeenWithoutSocketLongerThan(Duration gracePeriod, Instant now) {
		if (this.withoutSocketSince == null) {
			return false;
		}

		return Duration.between(this.withoutSocketSince, now).compareTo(gracePeriod) > 0;
	}

	public synchronized Set<String> getSocketIds() {
		return Set.copyOf(this.socketIds);
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

	public User clone() {
		User cloned = new User(this.userCode.text(), this.name, this.platform);
		cloned.setLocale(this.locale);
		synchronized (this) {
			cloned.socketIds.addAll(this.socketIds);
			cloned.withoutSocketSince = this.withoutSocketSince;
		}
		return cloned;
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
