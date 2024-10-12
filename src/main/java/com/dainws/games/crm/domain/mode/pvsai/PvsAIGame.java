package com.dainws.games.crm.domain.mode.pvsai;

import java.util.List;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.classic.ClassicGame;

public class PvsAIGame extends ClassicGame {

	protected PvsAIGame(List<Player> players) {
		super(players);
	}
	
	protected PvsAIGame(Board board, List<Player> players) {
		super(board, players);
	}
	
	@Override
	public GameMode getMode() {
		return new GameMode("PLAYER_VS_AI");
	}
}
