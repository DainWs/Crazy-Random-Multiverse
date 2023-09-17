package com.dainws.games.crm.console.domain.models.exceptions;

import com.dainws.games.cbg.domain.GameCode;

public class GameAlreadyExistException extends GameException {

	private static final long serialVersionUID = -6845200024509130910L;

	public GameAlreadyExistException(GameCode gameCode) {
		super("La partida con codigo " + gameCode + " ya existe");
	}
}
