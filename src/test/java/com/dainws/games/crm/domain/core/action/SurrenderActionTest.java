package com.dainws.games.crm.domain.core.action;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.tools.domain.builder.CardBuilder;
import com.dainws.games.crm.tools.domain.builder.GameBuilder;

public class SurrenderActionTest implements ActionTest {

	Action action;
	
	@BeforeEach
	void beforeEach() {
		this.action = new SurrenderAction();
	}
	
	@Test
	@Override
	public void testGivenContext_whenPerform_thenActionIsPerformed() throws GameException {
		CustomActionContext actionContext = this.createActionContext();

		assertDoesNotThrow(() -> this.action.perform(actionContext));
	}
	
	@Test
	public void testGivenContext_whenPerform_thenPlayerZoneIsDead() throws GameException {
		CustomActionContext actionContext = this.createActionContext();

		this.action.perform(actionContext);

		Zone zone = actionContext.getSourceZone();
		assertFalse(zone.isAlive());
	}
	
	@Test
	public void testGivenContext_whenPerform_thenPlayerZoneHasNoneCombatant() throws GameException {
		CustomActionContext actionContext = this.createActionContext();

		this.action.perform(actionContext);

		Zone zone = actionContext.getSourceZone();
		assertFalse(zone.hasCombatants());
	}

	private CustomActionContext createActionContext() throws GameException {
		Game game = new GameBuilder().withNRandomPlayers(5).build();

		Player player = game.getPlayers().get(3);
		Zone zone = game.getBoard().getZoneOf(player);
		Leader leader = new CardBuilder().buildFullValidLeader();
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(player);
		return actionContext;
	}
}
