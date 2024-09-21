package com.dainws.games.crm.domain.ai.decision;

import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class ContextDecisionEngine {
	protected Game game;
	protected AIPlayer me;
	protected Zone myZone;

	public void applySelfAwareness(Game game, AIPlayer meAsAPlayer) {
		this.game = game;
		this.me = meAsAPlayer;
		Board board = this.game.getBoard();
		this.myZone = board.getZoneOf(this.me); 
	}

	public abstract Player decideTargetPlayer(AIActionTemplate actionTemplate, Goal goal);

	public abstract Card decideSourceCard(AIActionTemplate actionTemplate, Goal goal);

	public abstract Card decideTargetCard(AIActionTemplate actionTemplate, Goal goal);

	public abstract Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate, Goal goal);

	public abstract Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate, Goal goal);
	
	protected final List<Player> getPlayersExceptMe() {
		return this.game.getAlivePlayers().stream()
				.filter(player -> !player.equals(this.me))
				.toList();
	}
}
