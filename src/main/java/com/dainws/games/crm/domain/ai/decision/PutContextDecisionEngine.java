package com.dainws.games.crm.domain.ai.decision;

import java.util.Collections;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class PutContextDecisionEngine extends ContextDecisionEngine {

	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate, Goal goal) {
		return this.me;
	}

	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate, Goal goal) {
		return this.decideTargetCard(actionTemplate, goal);
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate, Goal goal) {
		Hand hand = this.me.getHand();
		if (this.shouldDecideLeader()) {
			return hand.getCardsOf(CardType.LEADER).get(0);
		}

		if (hand.contains(CardType.WARRIOR)) {
			List<Card> cards = hand.getCardsOf(CardType.WARRIOR);
			Collections.shuffle(cards);
			return cards.get(0);
		}

		return null;
	}

	@Override
	public Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		return null;
	}

	@Override
	public Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		if (this.shouldDecideLeader()) {
			return ZoneWithLeader.LEADER_COORDINATE;
		}

		return PutAction.NEXT_EMPTY_COORDINATE;
	}

	private boolean shouldDecideLeader() {
		if (!(this.myZone instanceof ZoneWithLeader)) {
			return false;
		}

		if (this.myZone.hasCombatant(ZoneWithLeader.LEADER_COORDINATE)) {
			return false;
		}

		return this.me.getHand().contains(CardType.LEADER);
	}

}
