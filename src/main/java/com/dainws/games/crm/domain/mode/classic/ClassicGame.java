package com.dainws.games.crm.domain.mode.classic;

import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.player.Player;

public class ClassicGame extends Game {

	protected ClassicGame(List<Player> players) {
		super(players);
	}
	
	protected ClassicGame(Board board, List<Player> players) {
		super(board, players);
	}
	
	@Override
	public GameMode getMode() {
		return new GameMode("CLASSIC");
	}
	
}
