package com.dainws.games.crm.domain.ai;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.action.MutableActionContext;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public interface AIContext {
	GameCode getGameCode();

	GameMode getGameMode();

	boolean isGameRunning();

	Board getBoard();

	Zone getMyZone();

	Zone getPlayerZone(Player player);

	Player getMeAsPlayer();

	Player getPlayer(PlayerCode code);

	PlayerStorage getAlivePlayers();
	
	Hand getMyHand();
	
	MutableActionContext createMutableActionContext();
}
