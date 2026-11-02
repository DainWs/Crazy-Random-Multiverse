package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.DummyZone;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.ZoneExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;

class PutActionTest extends PlayerTurnActionTest {

	private static final int OUTSIDE_INDEX = 100;

	@Test
	void testGivenContext_whenPerform_thenCoordinateNowHasCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertTrue(zone.hasCombatant(actionContext.getTargetCoordinate()));
	}

	@Test
	void testGivenContext_whenPerform_thenPutCardInCoordinate() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertThat(zone.getCombatant(actionContext.getTargetCoordinate()))
			.isEqualTo(actionContext.getSourceCard());
	}

	@Test
	void testGivenContextWithFilledCoordinate_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Warrior filledWithCard = new CardBuilder().buildFullValidWarrior();
		Zone targetZone = actionContext.getTargetZone();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		targetZone.putCombatant(coordinate, filledWithCard);

		assertFalse(turnAction.perform(actionContext).isSuccessful());
	}

	@Test
	void testGivenContextWithFilledCoordinate_whenPerform_thenCodeIsPositionAlreadyHasCombatant() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Warrior filledWithCard = new CardBuilder().buildFullValidWarrior();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		actionContext.getTargetZone().putCombatant(coordinate, filledWithCard);

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(PlayerActionExceptionCode.Code.SELECTED_TARGET_POSITION_ALREADY_HAS_COMBATANT));
	}

	@Test
	void testGivenCardOutsideTheHand_whenPerform_thenCodeIsCardNotFound() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setSourceCard(new CardBuilder().buildFullValidLeader());

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(PlayerActionExceptionCode.Code.SELECTED_CARD_NOT_FOUND));
	}

	@Test
	void testGivenEquipmentCard_whenPerform_thenCodeIsCardIsNotCombatant() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Card equipment = new CardBuilder().buildFullValidEquipment();
		actionContext.getSourcePlayer().getHand().addCard(equipment);
		actionContext.setSourceCard(equipment);

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(PlayerActionExceptionCode.Code.SELECTED_CARD_IS_NOT_COMBATANT));
	}

	@Test
	void testGivenNoTargetCoordinate_whenPerform_thenCodeIsTargetCoordinateIsNull() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(null);

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(PlayerActionExceptionCode.Code.SELECTED_TARGET_COORDINATE_IS_NULL));
	}

	@Test
	void testGivenCoordinateOutsideTheZone_whenPerform_thenCodeIsOutOfBounds() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(new Coordinate(OUTSIDE_INDEX, OUTSIDE_INDEX));

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new ZoneExceptionCode(ZoneExceptionCode.Code.COORDINATE_OUT_OF_BOUNDS));
	}

	@Test
	void testGivenWarriorOnTheLeaderSlot_whenPerform_thenCodeIsRequiresLeader() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Player player = actionContext.getSourcePlayer();
		actionContext.getBoard().setZone(player, new ZoneWithLeader());
		actionContext.setTargetCoordinate(ZoneWithLeader.LEADER_COORDINATE);

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new ZoneExceptionCode(ZoneExceptionCode.Code.COORDINATE_REQUIRES_LEADER));
	}

	@Test
	void testGivenPreviousRowNotFilled_whenPerform_thenCodeIsPreviousRowNeedsToBeFilled() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(new Coordinate(1, 0));

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new ZoneExceptionCode(ZoneExceptionCode.Code.PREVIOUS_ROW_NEEDS_TO_BE_FILLED));
	}

	private ExceptionCode performAndGetCode(CustomActionContext actionContext) {
		return this.createPlayerTurnAction().perform(actionContext).getExceptionCode();
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new PutAction();
	}

	@Override
	protected CustomActionContext createActionContext() {
		Game game = new GameBuilder().withNRandomPlayers(5).build();

		Player playerWithTurn = this.getPlayerWithTurn(game);
		playerWithTurn.getHand().addCard(new CardBuilder().buildFullValidWarrior());
		Card warriorCard = this.getAnyPlayerCard(playerWithTurn, CardType.WARRIOR);
		Coordinate targetCoordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		game.getBoard().setZone(playerWithTurn, new DummyZone());

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(playerWithTurn);
		actionContext.setSourceCard(warriorCard);

		actionContext.setTargetPlayer(playerWithTurn);
		actionContext.setTargetCoordinate(targetCoordinate);
		actionContext.setTargetCard(warriorCard);
		return actionContext;
	}
}
