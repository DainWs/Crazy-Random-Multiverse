package com.dainws.games.cbg.domain.text;

import java.util.Objects;

public class TextLanguage {
	
	public static final TextLanguage UNKNOWN_LANGUAGE = new TextLanguage("??");

	private String isoAlphaTwo;
	
	private TextLanguage(String isoAlphaTwo) {
		this.isoAlphaTwo = isoAlphaTwo;
	}
	
	public String getIsoAlphaTwo() {
		return isoAlphaTwo;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		
		if (obj == null || obj.getClass() != this.getClass()) {
			return false;
		}
		
		TextLanguage that = (TextLanguage) obj;
		return Objects.equals(this, that);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.isoAlphaTwo);
	}
	
	@Override
	public String toString() {
		return "[%s]".formatted(this.isoAlphaTwo);
	}
	
	public static TextLanguage from(String isoAlphaTwo) {
		if (isoAlphaTwo.length() != 2) {
			throw new IllegalArgumentException("Invalid ISO of type 3166-1 alpha-2");
		}
		
		return new TextLanguage(isoAlphaTwo);
	}
}
