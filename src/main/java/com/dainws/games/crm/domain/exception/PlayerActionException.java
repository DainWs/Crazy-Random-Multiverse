package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.models.player.Player;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.domain.translator.TranslatableKey;

public class PlayerActionException extends GameException {

	private static final long serialVersionUID = -1029563058707798026L;

	private Player source;
	
	public PlayerActionException(Player source, Translatable translatable) {
		super(translatable);
		this.source = source;
	}
	
	public PlayerActionException(Player source, Translatable translatable, Throwable throwable) {
		super(translatable, throwable);
		this.source = source;
	}
	
	public PlayerActionException(Player source, String messageKey) {
		super(new TranslatableKey(messageKey));
		this.source = source;
	}
	
	public PlayerActionException(Player source, TranslatableKey messageKey) {
		super(messageKey);
		this.source = source;
	}
	
	public Player getSource() {
		return source;
	}
}
