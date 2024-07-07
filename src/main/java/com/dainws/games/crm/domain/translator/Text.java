package com.dainws.games.crm.domain.translator;

import java.util.Objects;

public class Text implements Translatable {
	private TranslatableKey key;
	private String value;

	public Text(String key) {
		this.key = new TranslatableKey(key);
	}
	
	public Text(TranslatableKey key) {
		this.key = key;
	}
	
	public Text(String key, String value) {
		this.key = new TranslatableKey(key);
		this.value = value;
	}
	
	public Text(TranslatableKey key, String value) {
		this.key = key;
		this.value = value;
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
