package com.dainws.games.crm.domain.ai.decision;

import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.MutableActionContext;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class ContextDecisionEngine {
	protected Game game;
	protected AIPlayer me;
	protected Zone myZone;

	protected Player sourcePlayer;
	protected Player targetPlayer;
	protected Card sourceCard;
	protected Card targetCard;
	protected Coordinate sourceCoordinate;
	protected Coordinate targetCoordinate;

	public final void applySelfAwareness(Game game, AIPlayer meAsAPlayer) {
		this.game = game;
		this.me = meAsAPlayer;
		Board board = this.game.getBoard();
		this.myZone = board.getZoneOf(this.me); 
	}
	
	public ActionContext decideContextFor(AIActionTemplate actionTemplate, Goal goal) {		
		this.makeDecisionsInOrder(actionTemplate, goal);

		MutableActionContext context = new MutableActionContext();
		context.setGame(this.game);
		context.setSourcePlayer(this.sourcePlayer);
		context.setTargetPlayer(this.targetPlayer);
		context.setSourceCard(this.sourceCard);
		context.setTargetCard(this.targetCard);
		context.setSourceCoordinate(this.sourceCoordinate);
		context.setTargetCoordinate(this.targetCoordinate);
		return context;
	}
	
	protected void makeDecisionsInOrder(AIActionTemplate actionTemplate, Goal goal) {
		this.sourcePlayer = this.decideSourcePlayer(actionTemplate, goal);
		this.targetPlayer = this.decideTargetPlayer(actionTemplate, goal);
		this.sourceCoordinate = this.decideSourceCoordinate(actionTemplate, goal);
		this.targetCoordinate = this.decideTargetCoordinate(actionTemplate, goal);
		this.sourceCard = this.decideSourceCard(actionTemplate, goal);
		this.targetCard = this.decideTargetCard(actionTemplate, goal);
	}

	protected Player decideSourcePlayer(AIActionTemplate actionTemplate, Goal goal) {
		return this.me;
	}

	protected abstract Player decideTargetPlayer(AIActionTemplate actionTemplate, Goal goal);

	protected abstract Card decideSourceCard(AIActionTemplate actionTemplate, Goal goal);

	protected abstract Card decideTargetCard(AIActionTemplate actionTemplate, Goal goal);

	protected abstract Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate, Goal goal);

	protected abstract Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate, Goal goal);
	
	protected final List<Player> getPlayersExceptMe() {
		return this.game.getAlivePlayers().stream()
				.filter(player -> !player.equals(this.me))
				.toList();
	}
}
