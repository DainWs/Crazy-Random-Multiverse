package com.dainws.games.crm.domain.error;

import com.dainws.games.crm.domain.translator.Text;

public class Error {
	private Text text;

	public Error(Text text) {
		this.text = text;
	}

	public Text getText() {
		return text;
	}
}
