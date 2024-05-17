package com.dainws.games.crm.domain.translator;

import java.util.Objects;

public class Text implements Translatable {
	private TranslatableKey key;
	private String value;
	private Language language;

	public Text(String key) {
		this.key = new TranslatableKey(key);
		this.language = Language.UNKNOWN_LANGUAGE;
	}
	
	public Text(TranslatableKey key) {
		this.key = key;
		this.language = Language.UNKNOWN_LANGUAGE;
	}
	
	public Text(String key, String value, Language language) {
		this.key = new TranslatableKey(key);
		this.value = value;
		this.language = language;
	}
	
	public Text(TranslatableKey key, String value, Language language) {
		this.key = key;
		this.value = value;
		this.language = language;
	}

	@Override
	public TranslatableKey getKey() {
		return key;
	}

	@Override
	public String getValue() {
		return value;
	}

	@Override
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

		Text that = (Text) obj;
		return Objects.equals(this.key, that.key);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.key);
	}
	
	@Override
	public String toString() {
		return this.value;
	}
}
