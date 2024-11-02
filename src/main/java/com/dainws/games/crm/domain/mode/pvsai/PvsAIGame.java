package com.dainws.games.crm.domain.mode.pvsai;

import java.util.List;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.classic.ClassicGame;

public class PvsAIGame extends ClassicGame {
	public static final GameMode PVSAI_GAME_MODE = new GameMode("PLAYER_VS_AI");

	protected PvsAIGame(Dealer dealer, List<Player> players) {
		super(dealer, players);
	}
	
	protected PvsAIGame(GameCode code, Dealer dealer, List<Player> players) {
		super(code, dealer, players);
	}
	
	@Override
	public GameMode getMode() {
		return PVSAI_GAME_MODE;
	}
}
