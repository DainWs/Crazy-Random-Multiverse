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
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;

class AttackActionTest extends PlayerTurnActionTest {

	private static final Coordinate ATTACKER_COORDINATE = new Coordinate(0, 0);
	private static final Coordinate TARGET_COORDINATE = new Coordinate(0, 0);
	private static final Coordinate FRONT_ROW_COORDINATE = new Coordinate(1, 0);

	@Test
	void testGivenTargetWithCombatantInFrontRow_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		this.fillRowAndPutInFrontRow(actionContext.getTargetZone());

		assertFalse(turnAction.perform(actionContext).isSuccessful());
	}

	@Test
	void testGivenTargetWithCombatantInFrontRow_whenPerform_thenCodeIsTargetIsProtected() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		this.fillRowAndPutInFrontRow(actionContext.getTargetZone());

		ActionResult result = turnAction.perform(actionContext);

		assertThat(result.getExceptionCode()).isEqualTo(new PlayerActionExceptionCode(Code.SELECTED_TARGET_IS_PROTECTED));
	}

	@Test
	void testGivenLeaderProtectedByAWarrior_whenPerform_thenCodeIsSourceLeaderIsProtected() throws GameException {
		CustomActionContext actionContext = this.createLeaderAttackContext();
		Zone sourceZone = actionContext.getSourceZone();
		sourceZone.putCombatant(FRONT_ROW_COORDINATE, new CardBuilder().buildFullValidWarrior());

		ActionResult result = this.createPlayerTurnAction().perform(actionContext);

		assertThat(result.getExceptionCode()).isEqualTo(new PlayerActionExceptionCode(Code.SELECTED_SOURCE_LEADER_IS_PROTECTED));
	}

	@Test
	void testGivenLeaderWithoutWarriors_whenPerform_thenAttackIsPerformed() throws GameException {
		CustomActionContext actionContext = this.createLeaderAttackContext();

		assertTrue(this.createPlayerTurnAction().perform(actionContext).isSuccessful());
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new AttackAction();
	}

	@Override
	protected CustomActionContext createActionContext()
			throws NotAllowedException {
		Game game = new GameBuilder().withNRandomPlayers(5).build();
		Player attacker = this.getPlayerWithTurn(game);
		Player defender = this.getPlayerWithoutTurn(game);
		Warrior attackerCard = new CardBuilder().buildFullValidWarrior();
		Warrior defenderCard = new CardBuilder().buildFullValidWarrior();
		this.getZoneOfPlayer(game, attacker)
				.putCombatant(ATTACKER_COORDINATE, attackerCard);
		this.getZoneOfPlayer(game, defender)
				.putCombatant(TARGET_COORDINATE, defenderCard);

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(attacker);
		actionContext.setSourceCard(attackerCard);
		actionContext.setSourceCoordinate(ATTACKER_COORDINATE);
		actionContext.setTargetPlayer(defender);
		actionContext.setTargetCard(defenderCard);
		actionContext.setTargetCoordinate(TARGET_COORDINATE);
		return actionContext;
	}

	private CustomActionContext createLeaderAttackContext() throws NotAllowedException {
		Game game = new GameBuilder().withNRandomPlayers(2).withZoneFactory(ZoneWithLeader::new).build();
		Player attacker = this.getPlayerWithTurn(game);
		Player defender = this.getPlayerWithoutTurn(game);
		Leader attackerLeader = CardBuilder.buildLeader();
		Leader defenderLeader = CardBuilder.buildLeader();
		this.getZoneOfPlayer(game, attacker).putCombatant(ZoneWithLeader.LEADER_COORDINATE, attackerLeader);
		this.getZoneOfPlayer(game, defender).putCombatant(ZoneWithLeader.LEADER_COORDINATE, defenderLeader);

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(attacker);
		actionContext.setSourceCard(attackerLeader);
		actionContext.setSourceCoordinate(ZoneWithLeader.LEADER_COORDINATE);
		actionContext.setTargetPlayer(defender);
		actionContext.setTargetCard(defenderLeader);
		actionContext.setTargetCoordinate(ZoneWithLeader.LEADER_COORDINATE);
		return actionContext;
	}

	private void fillRowAndPutInFrontRow(Zone zone) throws NotAllowedException {
		for (int column = 1; column < zone.getHorizontalDimension(0); column++) {
			Coordinate coordinate = new Coordinate(0, column);
			Warrior warrior = new CardBuilder().buildFullValidWarrior();
			zone.putCombatant(coordinate, warrior);
		}

		Warrior frontWarrior = new CardBuilder().buildFullValidWarrior();
		zone.putCombatant(FRONT_ROW_COORDINATE, frontWarrior);
	}
}
