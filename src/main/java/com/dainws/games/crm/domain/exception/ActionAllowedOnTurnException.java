package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.core.player.Player;

public class ActionAllowedOnTurnException extends PlayerActionException {

	private static final long serialVersionUID = -5538923892125185317L;

	public ActionAllowedOnTurnException(Player source) {
		super(source, "EXCEPTION_ALLOWED_ACTION_ONLY_ON_TURN");
	}

}
