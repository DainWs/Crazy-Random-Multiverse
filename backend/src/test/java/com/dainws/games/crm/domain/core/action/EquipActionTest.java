package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.domain.core.exception.ZoneExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;

class EquipActionTest extends PlayerTurnActionTest {

	private static final int OUTSIDE_INDEX = 100;

	@Test
	void testGivenContext_whenPerform_thenCombatantHasTheEquipment() throws GameException {
		CustomActionContext actionContext = this.createActionContext();

		this.createPlayerTurnAction().perform(actionContext);

		Combatant combatant = actionContext.getTargetZone().getCombatant(actionContext.getTargetCoordinate());
		assertThat(combatant.getEquipment()).hasSize(1);
	}

	// HAND-2
	@Test
	void testGivenContext_whenPerform_thenEquipmentLeavesTheHand() throws GameException {
		CustomActionContext actionContext = this.createActionContext();

		this.createPlayerTurnAction().perform(actionContext);

		assertThat(actionContext.getSourcePlayer().getHand().contains(actionContext.getSourceCard())).isFalse();
	}

	// EQUIP-4
	@Test
	void testGivenCombatantWithEquipment_whenPerformWithAnotherPiece_thenCombatantHasBothPieces() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		this.createPlayerTurnAction().perform(actionContext);
		Equipment anotherPiece = new CardBuilder().buildFullValidEquipment();
		actionContext.getSourcePlayer().getHand().addCard(anotherPiece);
		actionContext.setSourceCard(anotherPiece);

		this.createPlayerTurnAction().perform(actionContext);

		Combatant combatant = actionContext.getTargetZone().getCombatant(actionContext.getTargetCoordinate());
		assertThat(combatant.getEquipment()).hasSize(2);
	}

	@Test
	void testGivenCardOutsideTheHand_whenPerform_thenCodeIsCardNotFound() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		actionContext.getSourcePlayer().getHand().remove(actionContext.getSourceCard());

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(Code.SELECTED_CARD_NOT_FOUND));
	}

	@Test
	void testGivenWarriorCard_whenPerform_thenCodeIsCardIsNotEquipment() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Card warrior = new CardBuilder().buildFullValidWarrior();
		actionContext.getSourcePlayer().getHand().addCard(warrior);
		actionContext.setSourceCard(warrior);

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(Code.SELECTED_CARD_IS_NOT_EQUIPMENT));
	}

	// EQUIP-3
	@Test
	void testGivenCombatantOfAnotherPlayer_whenPerform_thenCodeIsEquipTargetNotOwned() throws GameException {
		CustomActionContext actionContext = this.createActionContextOnCombatantOfAnotherPlayer();

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(Code.EQUIP_TARGET_NOT_OWNED));
	}

	@Test
	void testGivenCombatantOfAnotherPlayer_whenPerform_thenEquipmentStaysInTheHand() throws GameException {
		CustomActionContext actionContext = this.createActionContextOnCombatantOfAnotherPlayer();

		this.createPlayerTurnAction().perform(actionContext);

		assertThat(actionContext.getSourcePlayer().getHand().contains(actionContext.getSourceCard())).isTrue();
	}

	@Test
	void testGivenEmptySlot_whenPerform_thenCodeIsTargetPositionHasNoneCombatant() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		Coordinate emptyCoordinate = this.getAvaibleCoordinateOnPlayerZone(actionContext.getGame(), actionContext.getSourcePlayer());
		actionContext.setTargetCoordinate(emptyCoordinate);

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new PlayerActionExceptionCode(Code.SELECTED_TARGET_POSITION_HAS_NONE_COMBATANT));
	}

	@Test
	void testGivenCoordinateOutsideTheZone_whenPerform_thenCodeIsOutOfBounds() throws GameException {
		CustomActionContext actionContext = this.createActionContext();
		actionContext.setTargetCoordinate(new Coordinate(OUTSIDE_INDEX, OUTSIDE_INDEX));

		ExceptionCode code = this.performAndGetCode(actionContext);

		assertThat(code).isEqualTo(new ZoneExceptionCode(ZoneExceptionCode.Code.COORDINATE_OUT_OF_BOUNDS));
	}

	private ExceptionCode performAndGetCode(CustomActionContext actionContext) {
		return this.createPlayerTurnAction().perform(actionContext).getExceptionCode();
	}

	private CustomActionContext createActionContextOnCombatantOfAnotherPlayer() throws NotAllowedException {
		CustomActionContext actionContext = this.createActionContext();
		Player otherPlayer = this.getPlayerWithoutTurn(actionContext.getGame());
		Coordinate coordinate = this.getAvaibleCoordinateOnPlayerZone(actionContext.getGame(), otherPlayer);
		this.putWarrior(actionContext.getGame(), otherPlayer, coordinate);
		actionContext.setTargetPlayer(otherPlayer);
		actionContext.setTargetCoordinate(coordinate);
		return actionContext;
	}

	private Warrior putWarrior(Game game, Player player, Coordinate coordinate) throws NotAllowedException {
		Warrior warrior = new CardBuilder().buildFullValidWarrior();
		Zone zone = this.getZoneOfPlayer(game, player);
		zone.putCombatant(coordinate, warrior);
		return warrior;
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new EquipAction();
	}

	@Override
	protected CustomActionContext createActionContext() throws NotAllowedException {
		Game game = new GameBuilder().withNRandomPlayers(5).build();
		Player playerWithTurn = this.getPlayerWithTurn(game);
		Coordinate coordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		this.putWarrior(game, playerWithTurn, coordinate);

		Equipment equipment = new CardBuilder().buildFullValidEquipment();
		playerWithTurn.getHand().addCard(equipment);

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(playerWithTurn);
		actionContext.setSourceCard(equipment);

		actionContext.setTargetPlayer(playerWithTurn);
		actionContext.setTargetCoordinate(coordinate);
		return actionContext;
	}
}
