package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;

class MoveActionTest extends PlayerTurnActionTest {

	@Test
	void testGivenContext_whenPerform_thenTargetCoordinateHasCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertTrue(zone.hasCombatant(actionContext.getTargetCoordinate()));
	}

	@Test
	void testGivenContext_whenPerform_thenSourceCoordinateHasntCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertFalse(zone.hasCombatant(actionContext.getSourceCoordinate()));
	}

	@Test
	void testGivenContext_whenPerform_thenMoveCardToCoordinate() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertThat(zone.getCombatant(actionContext.getTargetCoordinate())).isEqualTo(actionContext.getSourceCard());
	}

	@Test
	void testGivenContextWithFilledCoordinate_whenPerform_thenDoNotPerformAction()
			throws NotAllowedException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Warrior filledWithCard = new CardBuilder().buildFullValidWarrior();
		Zone targetZone = actionContext.getTargetZone();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		targetZone.putCombatant(coordinate, filledWithCard);

		assertFalse(turnAction.perform(actionContext));
	}

	@Test
	void testGivenTargetPlayerWithAnotherZone_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player otherPlayer = this.getPlayerWithoutTurn(actionContext.getGame());
		actionContext.setTargetPlayer(otherPlayer);

		boolean isPerformed = turnAction.perform(actionContext);

		assertFalse(isPerformed);
	}

	@Test
	void testGivenTargetPlayerWithAnotherZone_whenPerform_thenCombatantStaysInSourceCoordinate() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player otherPlayer = this.getPlayerWithoutTurn(actionContext.getGame());
		actionContext.setTargetPlayer(otherPlayer);

		turnAction.perform(actionContext);

		Zone sourceZone = actionContext.getSourceZone();
		Coordinate sourceCoordinate = actionContext.getSourceCoordinate();
		assertTrue(sourceZone.hasCombatant(sourceCoordinate));
	}

	@Test
	void testGivenLeaderAsSource_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		Leader leader = new CardBuilder().buildFullValidLeader();
		ZoneWithLeader zone = new ZoneWithLeader();
		CustomActionContext actionContext =
				this.createLeaderMoveContext(zone, leader);

		boolean isPerformed = turnAction.perform(actionContext);

		assertFalse(isPerformed);
	}

	@Test
	void testGivenLeaderAsSource_whenPerform_thenLeaderStaysInItsSlot() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		Leader leader = new CardBuilder().buildFullValidLeader();
		ZoneWithLeader zone = new ZoneWithLeader();
		CustomActionContext actionContext =
				this.createLeaderMoveContext(zone, leader);

		turnAction.perform(actionContext);

		assertThat(zone.getLeader()).isEqualTo(leader);
	}

	@Test
	void testGivenLeaderAsSource_whenPerform_thenLeaderIsNotDuplicated() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		Leader leader = new CardBuilder().buildFullValidLeader();
		ZoneWithLeader zone = new ZoneWithLeader();
		CustomActionContext actionContext =
				this.createLeaderMoveContext(zone, leader);

		turnAction.perform(actionContext);

		assertThat(zone.countCombatants()).isEqualTo(1);
	}

	@Test
	void testGivenTargetRowWithPreviousRowNotFilled_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(new Coordinate(1, 0));

		boolean isPerformed = turnAction.perform(actionContext);

		assertFalse(isPerformed);
	}

	@Test
	void testGivenTargetRowWithPreviousRowNotFilled_whenPerform_thenCombatantStaysInSourceCoordinate()
			throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(new Coordinate(1, 0));

		turnAction.perform(actionContext);

		Zone zone = actionContext.getSourceZone();
		assertThat(zone.getCombatant(actionContext.getSourceCoordinate()))
				.isEqualTo(actionContext.getSourceCard());
	}

	private CustomActionContext createLeaderMoveContext(ZoneWithLeader zone,
			Leader leader) throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);
		actionContext.getBoard().setZone(actionContext.getSourcePlayer(), zone);
		actionContext.setSourceCard(leader);
		actionContext.setSourceCoordinate(ZoneWithLeader.LEADER_COORDINATE);
		actionContext.setTargetCoordinate(new Coordinate(1, 0));
		return actionContext;
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new MoveAction();
	}

	@Override
	protected CustomActionContext createActionContext() throws NotAllowedException {
		Game game = new GameBuilder().withNRandomPlayers(5).build();

		Player playerWithTurn = this.getPlayerWithTurn(game);
		Zone zone = this.getZoneOfPlayerWithTurn(game);
		Coordinate coordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		Warrior warriorCard = new CardBuilder().buildFullValidWarrior();
		zone.putCombatant(coordinate, warriorCard);

		Coordinate targetCoordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(playerWithTurn);
		actionContext.setSourceCard(warriorCard);
		actionContext.setSourceCoordinate(coordinate);

		actionContext.setTargetPlayer(playerWithTurn);
		actionContext.setTargetCoordinate(targetCoordinate);
		actionContext.setTargetCard(warriorCard);
		return actionContext;
	}
}
