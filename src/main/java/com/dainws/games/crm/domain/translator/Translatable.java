package com.dainws.games.crm.domain.translator;

public interface Translatable {
	TranslatableKey getKey();
	String getValue();
	Language getLanguage();
}
