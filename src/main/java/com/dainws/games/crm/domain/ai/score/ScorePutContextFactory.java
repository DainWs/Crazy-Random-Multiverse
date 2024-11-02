package com.dainws.games.crm.domain.ai.score;

import java.util.Collections;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

class ScorePutContextFactory extends ActionContextFactory {

	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate) {
		return this.getMeAsPlayer();
	}

	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate) {
		return this.decideTargetCard(actionTemplate);
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate) {
		Hand hand = this.getMyHand();
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
	public Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate) {
		return null;
	}

	@Override
	public Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate) {
		if (this.shouldDecideLeader()) {
			return ZoneWithLeader.LEADER_COORDINATE;
		}

		return PutAction.NEXT_EMPTY_COORDINATE;
	}

	private boolean shouldDecideLeader() {
		Zone myZone = this.getMyZone();
		if (!(myZone instanceof ZoneWithLeader)) {
			return false;
		}

		if (myZone.hasCombatant(ZoneWithLeader.LEADER_COORDINATE)) {
			return false;
		}

		return this.getMyHand().contains(CardType.LEADER);
	}

}
