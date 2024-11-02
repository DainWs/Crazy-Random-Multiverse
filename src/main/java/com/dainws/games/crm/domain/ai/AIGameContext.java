package com.dainws.games.crm.domain.ai;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.action.MutableActionContext;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class AIGameContext implements AIContext {
	private Game game;
	private AIPlayer me;
	
	public AIGameContext(Game game, AIPlayer me) {
		this.game = game;
		this.me = me;
	}
	
	@Override
	public GameCode getGameCode() {
		return this.game.getCode();
	}
	
	@Override
	public GameMode getGameMode() {
		return this.game.getMode();
	}

	@Override
	public boolean isGameRunning() {
		return this.game.isRunning();
	}

	@Override
	public Board getBoard() {
		return this.game.getBoard();
	}

	@Override
	public Zone getMyZone() {
		return this.game.getPlayerZone(this.me);
	}

	@Override
	public Zone getPlayerZone(Player player) {
		return this.game.getPlayerZone(player);
	}

	@Override
	public Player getMeAsPlayer() {
		return this.me;
	}

	@Override
	public Player getPlayer(PlayerCode code) {
		return this.getPlayer(code);
	}

	@Override
	public PlayerStorage getAlivePlayers() {
		return this.getAlivePlayers();
	}
	
	@Override
	public Hand getMyHand() {
		return this.me.getHand();
	}
	
	@Override
	public MutableActionContext createMutableActionContext() {
		MutableActionContext actionContext = new MutableActionContext();
		actionContext.setGame(this.game);
		actionContext.setSourcePlayer(this.me);
		return actionContext;
	}
}
