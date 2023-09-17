package com.dainws.games.crm.console.domain.models.exceptions;

import com.dainws.games.cbg.domain.GameCode;

public class GameNotFoundException extends GameException {

	private static final long serialVersionUID = -7992954174581338822L;

	public GameNotFoundException(GameCode gameCode) {
		super("No se pudo encontrar la partida con el codigo " + gameCode);
	}
}
