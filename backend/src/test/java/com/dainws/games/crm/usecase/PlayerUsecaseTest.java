package com.dainws.games.crm.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionType;
import com.dainws.games.crm.usecase.dto.CardCodeDto;
import com.dainws.games.crm.usecase.dto.PositionDto;

class PlayerUsecaseTest {

	private static final String USER_CODE = "user-1";
	private static final String OTHER_USER_CODE = "user-2";

	@Test
	void testGivenEquipAction_whenPerformAction_thenEquipIsPerformed() throws IllegalAccessException {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionDto actionDto = this.createActionDto(gameCode, ActionType.EQUIP_ACTION);
		actionDto.setSourceCardCode(new CardCodeDto());
		actionDto.setTargetPosition(new PositionDto());

		new PlayerUsecase(facade).performAction(gameCode, this.createUser(USER_CODE), actionDto);

		assertThat(facade.performedActions).containsExactly(ActionType.EQUIP_ACTION);
	}

	@Test
	void testGivenSurrenderAction_whenPerformAction_thenSurrenderIsPerformed() throws IllegalAccessException {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionDto actionDto = this.createActionDto(gameCode, ActionType.SURRENDER_ACTION);

		new PlayerUsecase(facade).performAction(gameCode, this.createUser(USER_CODE), actionDto);

		assertThat(facade.performedActions).containsExactly(ActionType.SURRENDER_ACTION);
	}

	@Test
	void testGivenSourcePlayerOfAnotherUser_whenPerformAction_thenAccessIsDenied() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionDto actionDto = this.createActionDto(gameCode, ActionType.PASS_TURN);
		User otherUser = this.createUser(OTHER_USER_CODE);
		PlayerUsecase playerUsecase = new PlayerUsecase(facade);

		assertThatThrownBy(() -> playerUsecase.performAction(gameCode, otherUser, actionDto))
				.isInstanceOf(IllegalAccessException.class);
		assertThat(facade.performedActions).isEmpty();
	}

	private ActionDto createActionDto(GameCode gameCode, ActionType type) {
		ActionDto actionDto = new ActionDto();
		actionDto.setGameCode(gameCode.text());
		actionDto.setType(type);
		actionDto.setSourcePlayerCode(USER_CODE);
		return actionDto;
	}

	private User createUser(String code) {
		return new User(code, "name", UserPlatform.WEB);
	}

	private static class RecordingPlayerActionFacade extends PlayerActionFacade {
		private final List<ActionType> performedActions = new ArrayList<>();

		RecordingPlayerActionFacade() {
			super(null);
		}

		@Override
		public boolean playerEquipCard(ActionContextTemplate contextTemplate) {
			return this.performedActions.add(ActionType.EQUIP_ACTION);
		}

		@Override
		public boolean playerSurrender(ActionContextTemplate contextTemplate) {
			return this.performedActions.add(ActionType.SURRENDER_ACTION);
		}

		@Override
		public boolean playerPassTurn(ActionContextTemplate contextTemplate) {
			return this.performedActions.add(ActionType.PASS_TURN);
		}
	}
}
