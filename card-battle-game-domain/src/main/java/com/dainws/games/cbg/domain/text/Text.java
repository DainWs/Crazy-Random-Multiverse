package com.dainws.games.cbg.domain.text;

import java.util.Objects;

public class Text implements Translatable {
	private TextKey key;
	private String value;
	private TextLanguage language;

	public Text(String key) {
		this.key = new TextKey(key);
		this.language = TextLanguage.UNKNOWN_LANGUAGE;
	}
	
	public Text(TextKey key) {
		this.key = key;
		this.language = TextLanguage.UNKNOWN_LANGUAGE;
	}
	
	public Text(String key, String value, TextLanguage language) {
		this.key = new TextKey(key);
		this.value = value;
		this.language = language;
	}
	
	public Text(TextKey key, String value, TextLanguage language) {
		this.key = key;
		this.value = value;
		this.language = language;
	}

	@Override
	public TextKey getKey() {
		return key;
	}
	
	public String getValue() {
		return value;
	}
	
	public TextLanguage getLanguage() {
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
}
