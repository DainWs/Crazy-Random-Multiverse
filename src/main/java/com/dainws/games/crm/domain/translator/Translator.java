package com.dainws.games.crm.domain.translator;

import java.util.Locale;

public interface Translator {
	Text translate(Translatable message);
	Text translate(Translatable message, Locale locale);
}
