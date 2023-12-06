package com.dainws.games.cbg.domain.translator;

public interface Translator {
	Text translate(Translatable message, Language language);
}
