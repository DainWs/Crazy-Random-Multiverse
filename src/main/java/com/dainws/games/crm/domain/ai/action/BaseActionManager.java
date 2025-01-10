package com.dainws.games.crm.domain.ai.action;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class BaseActionManager extends AbstractActionManager {

	protected BaseActionManager() {
		super();
	}
	
	@Override
	protected final List<AIActionTemplate> defineActionTemplates(AIContext context) {
		this.logger.trace("Defining actions for behavior");
		List<AIActionTemplate> actionTemplates = new ArrayList<>();

		if (this.shouldDefineNeutralActions(context)) {
			this.logger.trace("Defining neutral actions for behavior");
			actionTemplates.addAll(this.defineNeutralActions(context));
		}

		if (this.shouldDefineDefensiveActions(context)) {
			this.logger.trace("Defining defensive actions for behavior");
			actionTemplates.addAll(this.defineDefensiveActions(context));
		}

		if (this.shouldDefineAggressiveActions(context)) {
			this.logger.trace("Defining aggressive actions for behavior");
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
		List<Player> alivePlayers = context.getAlivePlayers().filter(itsNotMe); 
		if (alivePlayers.isEmpty()) {
			return false;
		}
		
		boolean canBeAggressive = false;
		for (Player player : alivePlayers) {
			Zone playerZone = context.getPlayerZone(player);
			if (playerZone.hasCombatants(Combatant::canAttack)) {
				canBeAggressive = true;
			}
		}
		return canBeAggressive;
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
		boolean spellsInHand = hand.contains(CardType.SPELL);
		return (leaderInHand || warriorsInHand || spellsInHand);
	}

	protected List<AIActionTemplate> defineNeutralActions(AIContext context) {
		List<AIActionTemplate> templates = new ArrayList<>();
		templates.add(new PutCardActionTemplate());
		templates.add(new UseSpellCardActionTemplate());
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
