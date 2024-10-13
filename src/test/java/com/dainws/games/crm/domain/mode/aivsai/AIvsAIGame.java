package com.dainws.games.crm.domain.mode.aivsai;

import java.util.List;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.classic.ClassicGame;

public class AIvsAIGame extends ClassicGame {

	AIvsAIGame(Board board, Dealer dealer, List<Player> players) {
		super(board, dealer, players);
	}
	
	@Override
	public GameMode getMode() {
		return new GameMode("AI_VS_AI");
	}
}
