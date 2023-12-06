package com.dainws.games.cbg.domain.translator;

import java.util.Objects;

public class Error implements Translatable {

	private TranslatableKey key;
	private String value;
	private Language language;

	public Error(String key) {
		this.key = new TranslatableKey(key);
		this.language = Language.UNKNOWN_LANGUAGE;
	}
	
	public Error(TranslatableKey key) {
		this.key = key;
		this.language = Language.UNKNOWN_LANGUAGE;
	}
	
	public Error(String key, String value, Language language) {
		this.key = new TranslatableKey(key);
		this.value = value;
		this.language = language;
	}
	
	public Error(TranslatableKey key, String value, Language language) {
		this.key = key;
		this.value = value;
		this.language = language;
	}

	@Override
	public TranslatableKey getKey() {
		return key;
	}
	
	public String getValue() {
		return value;
	}
	
	public Language getLanguage() {
		return language;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return false;
		}

		if (obj == null || obj.getClass() != this.getClass()) {
			return false;
		}

		Error that = (Error) obj;
		return Objects.equals(this.key, that.key);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.key);
	}
}
