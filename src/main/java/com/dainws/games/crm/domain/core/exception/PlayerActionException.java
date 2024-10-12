package com.dainws.games.crm.domain.core.exception;

import com.dainws.games.crm.domain.core.player.Player;

public class PlayerActionException extends GameException {

	private static final long serialVersionUID = -1029563058707798026L;

	private Player source;
	
	public PlayerActionException(String code, Player source) {
		super(new PlayerActionExceptionCode(code));
		this.source = source;
	}
	
	public PlayerActionException(GameException throwable, Player source) {
		super(throwable.getCode(), throwable);
		this.source = source;
	}
	
	public PlayerActionException(GameRuntimeException throwable, Player source) {
		super(throwable.getCode(), throwable);
		this.source = source;
	}
	
	public PlayerActionException(PlayerActionExceptionCode code, Player source) {
		super(code);
		this.source = source;
	}
	
	public PlayerActionException(PlayerActionExceptionCode code, Player source, Throwable throwable) {
		super(code, throwable);
		this.source = source;
	}
	
	public Player getSource() {
		return this.source;
	}
}
