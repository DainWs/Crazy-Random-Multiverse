package com.dainws.games.cbg.domain.translator;

public interface Translatable {
	TranslatableKey getKey();
	public String getValue();
	Language getLanguage();
}
