package com.dainws.games.crm.domain.ai.score;

import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.MutableActionContext;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

abstract class ActionContextFactory {
	private AIContext aiContext;

	protected Player sourcePlayer;
	protected Player targetPlayer;
	protected Card sourceCard;
	protected Card targetCard;
	protected Coordinate sourceCoordinate;
	protected Coordinate targetCoordinate;

	public ActionContext decideContextFor(AIContext aiContext, AIActionTemplate actionTemplate) {
		this.aiContext = aiContext;

		this.makeDecisionsInOrder(actionTemplate);

		MutableActionContext context = aiContext.createMutableActionContext();
		context.setSourcePlayer(this.sourcePlayer);
		context.setTargetPlayer(this.targetPlayer);
		context.setSourceCard(this.sourceCard);
		context.setTargetCard(this.targetCard);
		context.setSourceCoordinate(this.sourceCoordinate);
		context.setTargetCoordinate(this.targetCoordinate);
		return context;
	}

	protected void makeDecisionsInOrder(AIActionTemplate actionTemplate) {
		this.sourcePlayer = this.decideSourcePlayer(actionTemplate);
		this.targetPlayer = this.decideTargetPlayer(actionTemplate);
		this.sourceCoordinate = this.decideSourceCoordinate(actionTemplate);
		this.targetCoordinate = this.decideTargetCoordinate(actionTemplate);
		this.sourceCard = this.decideSourceCard(actionTemplate);
		this.targetCard = this.decideTargetCard(actionTemplate);
	}

	protected Player decideSourcePlayer(AIActionTemplate actionTemplate) {
		return this.aiContext.getMeAsPlayer();
	}

	protected abstract Player decideTargetPlayer(AIActionTemplate actionTemplate);

	protected abstract Card decideSourceCard(AIActionTemplate actionTemplate);

	protected abstract Card decideTargetCard(AIActionTemplate actionTemplate);

	protected abstract Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate);

	protected abstract Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate);

	protected final Player getMeAsPlayer() {
		return this.aiContext.getMeAsPlayer();
	}

	protected final Zone getMyZone() {
		return this.aiContext.getMyZone();
	}

	protected final Hand getMyHand() {
		return this.aiContext.getMyHand();
	}

	protected final Zone getZoneOf(Player player) {
		return this.aiContext.getPlayerZone(player);
	}

	protected final List<Player> getPlayersExceptMe() {
		Player me = this.aiContext.getMeAsPlayer();
		Predicate<Player> isNotMe = Predicate.not(me::equals);
		return this.aiContext.getAlivePlayers().filter(isNotMe);
	}
}
