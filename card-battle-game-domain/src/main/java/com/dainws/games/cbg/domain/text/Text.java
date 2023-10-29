package com.dainws.games.cbg.domain.text;

import java.util.Objects;

public class Text implements Translatable {
	private String key;
	private String value;

	public Text(String key, String value) {
		this.key = key;
		this.value = value;
	}

	@Override
	public String getKey() {
		return key;
	}
	
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
}
