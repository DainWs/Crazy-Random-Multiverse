package com.dainws.games.cbg.domain.translator;

public interface Translatable {
	TranslatableKey getKey();
	String getValue();
	Language getLanguage();
}
