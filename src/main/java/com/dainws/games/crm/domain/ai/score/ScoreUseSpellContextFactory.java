package com.dainws.games.crm.domain.ai.score;

import java.util.Collections;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

// TODO need a review
class ScoreUseSpellContextFactory extends ActionContextFactory {

	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate) {
		return this.getMeAsPlayer(); // Not correct for agresive spells
	}

	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate) {
		Hand hand = this.getMyHand();
		if (hand.contains(CardType.SPELL)) {
			return hand.getCardsOf(CardType.SPELL).get(0);			
		}
		return null;
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate) {
		Hand hand = this.getMyHand(); // Not correct for agresive spells
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
		return null;
	}

}
