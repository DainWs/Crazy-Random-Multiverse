package com.dainws.games.crm.domain.ai.action;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class BaseActionManager extends AbstractActionManager {

	@Override
	protected final List<AIActionTemplate> defineActionTemplates(AIContext context) {
		List<AIActionTemplate> actionTemplates = new ArrayList<>();

		if (this.shouldDefineNeutralActions(context)) {
			actionTemplates.addAll(this.defineNeutralActions(context));
		}

		if (this.shouldDefineDefensiveActions(context)) {
			actionTemplates.addAll(this.defineDefensiveActions(context));
		}

		if (this.shouldDefineAggressiveActions(context)) {
			actionTemplates.addAll(this.defineAggressiveActions(context));
		}

		return actionTemplates;
	}

	protected boolean shouldDefineAggressiveActions(AIContext context) {
		Zone zone = context.getMyZone();
		if (!zone.hasCombatants()) {
			return false;
		}

		Player me = context.getMeAsPlayer();
		Predicate<Player> itsNotMe = Predicate.not(me::equals);
		return context.getAlivePlayers().anyMatch(itsNotMe);
	}

	protected List<AIActionTemplate> defineAggressiveActions(AIContext context) {
		List<AIActionTemplate> templates = new ArrayList<>();
		templates.add(new AttackPlayerActionTemplate());
		return templates;
	}

	protected boolean shouldDefineNeutralActions(AIContext context) {
		Hand hand = context.getMyHand();
		boolean leaderInHand = hand.contains(CardType.LEADER);
		boolean warriorsInHand = hand.contains(CardType.WARRIOR);
		return (leaderInHand || warriorsInHand);
	}

	protected List<AIActionTemplate> defineNeutralActions(AIContext context) {
		List<AIActionTemplate> templates = new ArrayList<>();
		templates.add(new PutCardActionTemplate());
		return templates;
	}

	protected boolean shouldDefineDefensiveActions(AIContext context) {
		Hand hand = context.getMyHand();
		return hand.contains(CardType.EQUIPMENT);
	}

	protected List<AIActionTemplate> defineDefensiveActions(AIContext context) {
		List<AIActionTemplate> templates = new ArrayList<>();
		return templates;
	}
}
