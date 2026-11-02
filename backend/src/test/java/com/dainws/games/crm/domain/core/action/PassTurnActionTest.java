package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.exception.GameExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;

class PassTurnActionTest extends PlayerTurnActionTest {

	@Test
	void testGivenOnlyOneAlivePlayer_whenPerform_thenIsNotSuccessful() {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createContextWithOnlyOneAlivePlayer();

		ActionResult result = turnAction.perform(actionContext);

		assertThat(result.isSuccessful()).isFalse();
	}

	@Test
	void testGivenOnlyOneAlivePlayer_whenPerform_thenCodeIsGameNotInProgress() {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createContextWithOnlyOneAlivePlayer();

		ActionResult result = turnAction.perform(actionContext);

		assertThat(result.getExceptionCode()).isEqualTo(GameExceptionCode.NOT_IN_PROGRESS);
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new PassTurnAction();
	}

	@Override
	protected CustomActionContext createActionContext() {
		Game game = new GameBuilder().withNRandomPlayers(3).build();
		return this.createContextOfPlayerWithTurn(game);
	}

	private CustomActionContext createContextWithOnlyOneAlivePlayer() {
		Game game = new GameBuilder().withNRandomPlayers(2).build();
		Player rival = this.getPlayerWithoutTurn(game);
		rival.die();
		return this.createContextOfPlayerWithTurn(game);
	}

	private CustomActionContext createContextOfPlayerWithTurn(Game game) {
		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(this.getPlayerWithTurn(game));
		return actionContext;
	}
}
