package com.dainws.games.crm.domain.ai;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;

@DisplayName("Behavior - Second round tests")
public class SecondRoundBehaviorIntegrationTest extends AIGameBehaviorIntegrationTest {
	
	public SecondRoundBehaviorIntegrationTest() {
		super();
	}

	@Override
	protected void beforeEach() {
	}

	@Test
	void testGivenFirstRound_whenAIPerformBehavior_thenShouldPutCard() {
		this.aiPlayer.performBehavior(this.game);
		
		assertTrue(this.actionMonitor.wasActionExecuted(PutAction.class));
	}
	
	@Test
	void testGivenFirstRound_whenAIPerformBehavior_thenPutLeaderCard() {
		this.aiPlayer.performBehavior(this.game);

		ActionContext context = this.actionMonitor.getExecutedActionContext(0);
		Card targetCard = context.getTargetCard();
		assertTrue(targetCard.isType(CardType.LEADER));
	}
	
	@Test
	void testGivenFirstRound_whenAIPerformBehavior_thenZoneHasCard() {
		this.aiPlayer.performBehavior(this.game);

		Board board = this.game.getBoard();
		Zone zone = board.getZoneOf(this.aiPlayer);
		ActionContext context = this.actionMonitor.getExecutedActionContext(0);
		assertTrue(zone.hasCombatant(context.getTargetCoordinate()));
	}
	
	@Test
	void testGivenFirstRound_whenAIPerformBehavior_thenZoneHasLeader() {
		this.aiPlayer.performBehavior(this.game);

		Board board = this.game.getBoard();
		Zone zone = board.getZoneOf(this.aiPlayer);
		ActionContext context = this.actionMonitor.getExecutedActionContext(0);
		Card card = zone.getCombatant(context.getTargetCoordinate());
		assertTrue(card.isType(CardType.LEADER));
	}
}
