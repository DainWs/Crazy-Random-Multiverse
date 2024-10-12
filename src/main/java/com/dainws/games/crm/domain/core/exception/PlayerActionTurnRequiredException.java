package com.dainws.games.crm.domain.core.exception;

import com.dainws.games.crm.domain.core.player.Player;

public class PlayerActionTurnRequiredException extends PlayerActionException {

	private static final long serialVersionUID = -5538923892125185317L;

	public PlayerActionTurnRequiredException(Player source) {
		super("allowed_only_on_turn", source);
	}

}
