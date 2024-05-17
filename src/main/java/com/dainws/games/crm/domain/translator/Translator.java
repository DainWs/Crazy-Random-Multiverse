package com.dainws.games.crm.domain.translator;

public interface Translator {
	Text translate(Translatable message, Language language);
}
