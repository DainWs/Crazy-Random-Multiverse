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
import com.dainws.games.crm.domain.core.card.Card;
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
	void testGivenTargetWithCombatant_whenPerform_thenActionIsPerformed() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		this.fillTargetCoordinate(actionContext);

		assertTrue(turnAction.perform(actionContext));
	}

	@Test
	void testGivenTargetWithCombatant_whenPerform_thenTargetCoordinateHasTheMovedCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		this.fillTargetCoordinate(actionContext);

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		Card movedCard = actionContext.getSourceCard();
		assertThat(zone.getCombatant(coordinate)).isSameAs(movedCard);
	}

	@Test
	void testGivenTargetWithCombatant_whenPerform_thenSourceCoordinateHasTheTargetCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Warrior targetWarrior = this.fillTargetCoordinate(actionContext);

		turnAction.perform(actionContext);

		Zone zone = actionContext.getSourceZone();
		Coordinate coordinate = actionContext.getSourceCoordinate();
		assertThat(zone.getCombatant(coordinate)).isSameAs(targetWarrior);
	}

	@Test
	void testGivenSameSourceAndTargetCoordinate_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(actionContext.getSourceCoordinate());

		assertFalse(turnAction.perform(actionContext));
	}

	@Test
	void testGivenLeaderAsTarget_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		ZoneWithLeader zone = new ZoneWithLeader();
		CustomActionContext actionContext = this.createWarriorToLeaderContext(zone);

		assertFalse(turnAction.perform(actionContext));
	}

	@Test
	void testGivenLeaderAsTarget_whenPerform_thenLeaderStaysInItsSlot() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		ZoneWithLeader zone = new ZoneWithLeader();
		CustomActionContext actionContext = this.createWarriorToLeaderContext(zone);

		turnAction.perform(actionContext);

		assertThat(zone.getLeader()).isNotNull();
	}

	@Test
	void testGivenFullFirstRow_whenMoveToSecondRow_thenActionIsPerformed() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createMoveFromFullFirstRowContext();

		assertTrue(turnAction.perform(actionContext));
	}

	@Test
	void testGivenFullFirstRow_whenMoveToSecondRow_thenTargetCoordinateHasTheCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createMoveFromFullFirstRowContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		Card movedCard = actionContext.getSourceCard();
		assertThat(zone.getCombatant(coordinate)).isSameAs(movedCard);
	}

	@Test
	void testGivenFullFirstRow_whenMoveToSecondRow_thenNoCombatantIsLost() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createMoveFromFullFirstRowContext();
		Zone zone = actionContext.getSourceZone();
		int combatantsBefore = zone.countCombatants();

		turnAction.perform(actionContext);

		assertThat(zone.countCombatants()).isEqualTo(combatantsBefore);
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

	private Warrior fillTargetCoordinate(CustomActionContext actionContext)
			throws NotAllowedException {
		Warrior warrior = new CardBuilder().buildFullValidWarrior();
		Zone zone = actionContext.getTargetZone();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		zone.putCombatant(coordinate, warrior);
		return warrior;
	}

	private CustomActionContext createWarriorToLeaderContext(
			ZoneWithLeader zone) throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Warrior warrior = new CardBuilder().buildFullValidWarrior();
		Leader leader = new CardBuilder().buildFullValidLeader();
		Coordinate warriorCoordinate = new Coordinate(1, 0);
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);
		zone.putCombatant(warriorCoordinate, warrior);
		Player player = actionContext.getSourcePlayer();
		actionContext.getBoard().setZone(player, zone);
		actionContext.setSourceCard(warrior);
		actionContext.setSourceCoordinate(warriorCoordinate);
		actionContext.setTargetCoordinate(ZoneWithLeader.LEADER_COORDINATE);
		return actionContext;
	}

	private CustomActionContext createMoveFromFullFirstRowContext()
			throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Zone zone = actionContext.getSourceZone();
		Warrior secondWarrior = new CardBuilder().buildFullValidWarrior();
		Warrior thirdWarrior = new CardBuilder().buildFullValidWarrior();
		zone.putCombatant(new Coordinate(0, 1), secondWarrior);
		zone.putCombatant(new Coordinate(0, 2), thirdWarrior);
		actionContext.setTargetCoordinate(new Coordinate(1, 0));
		return actionContext;
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
