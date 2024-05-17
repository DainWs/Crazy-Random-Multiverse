package com.dainws.games.crm.domain.translator;

import java.util.Objects;

public class Language {
	
	public static final Language UNKNOWN_LANGUAGE = new Language("??");

	private String isoAlphaTwo;
	
	private Language(String isoAlphaTwo) {
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
		
		Language that = (Language) obj;
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
	
	public static Language from(String isoAlphaTwo) {
		if (isoAlphaTwo.length() != 2) {
			throw new IllegalArgumentException("Invalid ISO of type 3166-1 alpha-2");
		}
		
		return new Language(isoAlphaTwo);
	}
}
