package com.dainws.games.crm.controller;

import java.util.Locale;
import java.util.ResourceBundle;

import com.dainws.games.crm.domain.translator.Text;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.domain.translator.TranslatableKey;
import com.dainws.games.crm.domain.translator.Translator;

public class BundleTranslator implements Translator {
	
	@Override
	public Text translate(Translatable message) {
		Locale locale = Locale.getDefault();
		return this.translate(message, locale);
	}
	
	@Override
	public Text translate(Translatable message, Locale locale) {
		TranslatableKey key = message.getKey();
		ResourceBundle bundle = this.loadBundle(locale);

		if (!bundle.containsKey(key.getValue())) {
			return new Text(message.getKey(), message.getValue());
		}
		
		String translatedMessage = bundle.getString(key.getValue());
		return new Text(key, translatedMessage);
	}

	private ResourceBundle loadBundle(Locale locale) {
		return ResourceBundle.getBundle("Text", locale);
	}
}
