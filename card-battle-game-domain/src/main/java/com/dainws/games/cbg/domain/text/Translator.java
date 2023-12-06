package com.dainws.games.cbg.domain.text;

public interface Translator {
	Text translate(Translatable message, TextLanguage language);
}
