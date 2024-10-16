package com.dainws.games.crm.domain.mode.pvsai;

import java.util.List;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.classic.ClassicGame;

public class PvsAIGame extends ClassicGame {

	protected PvsAIGame(Dealer dealer, List<Player> players) {
		super(dealer, players);
	}
	
	protected PvsAIGame(Board board, Dealer dealer, List<Player> players) {
		super(board, dealer, players);
	}
	
	@Override
	public GameMode getMode() {
		return new GameMode("PLAYER_VS_AI");
	}
}
