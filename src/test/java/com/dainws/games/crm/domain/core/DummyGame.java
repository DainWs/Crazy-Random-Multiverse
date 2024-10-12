package com.dainws.games.crm.domain.core;

import java.util.List;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.player.Player;

public class DummyGame extends Game {

	public DummyGame(List<Player> players) {
		super(players);
	}
	
	public DummyGame(Board board, List<Player> players) {
		super(board, players);
	}

	@Override
	public GameMode getMode() {
		return new GameMode("DUMMY");
	}
	
}
