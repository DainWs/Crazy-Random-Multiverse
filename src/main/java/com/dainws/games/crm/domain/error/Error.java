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
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return false;
		}

		if (obj == null || obj.getClass() != this.getClass()) {
			return false;
		}
		
		Error that = (Error) obj;
		return this.text.equals(that.text);
	}
	
	@Override
	public int hashCode() {
		return super.hashCode();
	}
}
