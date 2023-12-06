package com.dainws.games.cbg.domain.communication;

import com.dainws.games.cbg.domain.translator.Text;

public class Error {
	private Text text;

	public Error(Text text) {
		this.text = text;
	}

	public Text getText() {
		return text;
	}
}
