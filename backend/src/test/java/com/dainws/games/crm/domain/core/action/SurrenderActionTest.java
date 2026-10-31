package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.player.Player;

class SurrenderActionTest extends PlayerTurnActionTest {

	@Test
	void testGivenContext_whenPerform_thenPlayerIsDead() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		assertThat(actionContext.getSourcePlayer().isAlive()).isFalse();
	}

	@Test
	void testGivenContext_whenPerform_thenPlayerIsSpectator() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		assertThat(actionContext.getSourcePlayer().isSpectator()).isTrue();
	}

	@Test
	void testGivenContext_whenPerform_thenPlayerZoneHasNoneCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getSourceZone();
		assertThat(zone.hasCombatants()).isFalse();
	}

	@Test
	void testGivenPlayerWithoutTurn_whenPerform_thenPlayerStaysAlive() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player playerWithoutTurn = this.getPlayerWithoutTurn(actionContext.getGame());
		actionContext.setSourcePlayer(playerWithoutTurn);

		turnAction.perform(actionContext);

		assertThat(playerWithoutTurn.isAlive()).isTrue();
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new SurrenderAction();
	}

	@Override
	protected CustomActionContext createActionContext() throws GameException {
		Game game = new GameBuilder() //
				.withZoneFactory(ZoneWithLeader::new) //
				.withNRandomPlayers(5) //
				.build();

		Player player = this.getPlayerWithTurn(game);
		Leader leader = new CardBuilder().buildFullValidLeader();
		this.getZoneOfPlayer(game, player).putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);
		this.getZoneOfPlayer(game, player).putCombatant(new Coordinate(1, 0), new CardBuilder().buildFullValidWarrior());

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(player);
		return actionContext;
	}
}
