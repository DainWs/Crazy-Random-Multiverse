package com.dainws.games.crm.domain.ai.decision;

import java.util.Collections;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class PutDecisionEngine extends ContextDecisionEngine {

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

		Board board = this.game.getBoard();
		Zone zone = board.getZoneOf(this.me);
		return this.decideCoordinate(zone);
	}
	
	private Coordinate decideCoordinate(Zone zone) {
		Integer rowIndex = this.decideRow(zone);
		
		if (rowIndex == null) {
			return null;
		}

		Integer	columnIndex = this.decideLineColumn(zone, rowIndex);
		return new Coordinate(rowIndex, columnIndex);
	}

	private Integer decideRow(Zone zone) {
		Integer rowIndex = null;

		int currentRow = 0;
		do {
			if (!zone.isLineFilled(currentRow)) {
				rowIndex = currentRow;
			}

			currentRow++;
		} while (rowIndex == null && currentRow < zone.getVerticalDimension());

		return rowIndex;
	}
	
	private Integer decideLineColumn(Zone zone, int row) {
		Integer rowColumnIndex = null;

		int currentColumn = 0;
		do {
			if (!zone.hasCombatant(new Coordinate(row, currentColumn))) {
				rowColumnIndex = currentColumn;
			}

			currentColumn++;
		} while (rowColumnIndex == null && currentColumn < zone.getHorizontalDimension());

		return rowColumnIndex;
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
