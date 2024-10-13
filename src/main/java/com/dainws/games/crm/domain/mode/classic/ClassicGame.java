package com.dainws.games.crm.domain.mode.classic;

import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.player.Player;

public class ClassicGame extends Game {

	protected ClassicGame(Dealer dealer, List<Player> players) {
		super(dealer, players);
	}
	
	protected ClassicGame(Board board, Dealer dealer, List<Player> players) {
		super(board, dealer, players);
	}
	
	@Override
	public GameMode getMode() {
		return new GameMode("CLASSIC");
	}
	
}
