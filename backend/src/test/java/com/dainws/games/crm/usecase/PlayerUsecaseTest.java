package com.dainws.games.crm.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.catchThrowable;

import org.assertj.core.api.ThrowableAssert.ThrowingCallable;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionType;
import com.dainws.games.crm.usecase.dto.CardCodeDto;
import com.dainws.games.crm.usecase.dto.PositionDto;

class PlayerUsecaseTest {

	private static final String USER_CODE = "user-1";
	private static final String OTHER_USER_CODE = "user-2";
	private static final String CARD_CODE = "42";

	@Test
	void testGivenEquipAction_whenPerformAction_thenEquipIsPerformed() throws IllegalAccessException {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionType type = ActionType.EQUIP_ACTION;
		ActionDto actionDto = this.createActionDto(gameCode, type);
		actionDto.setSourceCardCode(this.createCardCodeDto());
		actionDto.setTargetPosition(new PositionDto());

		PlayerUsecase playerUsecase = new PlayerUsecase(facade);
		User user = this.createUser(USER_CODE);

		playerUsecase.performAction(gameCode, user, actionDto);

		assertThat(facade.getPerformedActions())
				.containsExactly(ActionType.EQUIP_ACTION);
	}

	@Test
	void testGivenSurrenderAction_whenPerformAction_thenSurrenderIsPerformed() throws IllegalAccessException {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionType type = ActionType.SURRENDER_ACTION;
		ActionDto actionDto = this.createActionDto(gameCode, type);

		PlayerUsecase playerUsecase = new PlayerUsecase(facade);
		User user = this.createUser(USER_CODE);

		playerUsecase.performAction(gameCode, user, actionDto);

		assertThat(facade.getPerformedActions())
				.containsExactly(ActionType.SURRENDER_ACTION);
	}

	@Test
	void testGivenSourcePlayerOfAnotherUser_whenPerformAction_thenAccessIsDenied() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		ThrowingCallable performAction = this.performActionOfAnotherUser(facade);

		assertThatThrownBy(performAction)
				.isInstanceOf(IllegalAccessException.class);
	}

	@Test
	void testGivenSourcePlayerOfAnotherUser_whenPerformAction_thenNothingIsPerformed() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		ThrowingCallable performAction = this.performActionOfAnotherUser(facade);

		catchThrowable(performAction);

		assertThat(facade.getPerformedActions()).isEmpty();
	}

	private ThrowingCallable performActionOfAnotherUser(
			RecordingPlayerActionFacade facade) {
		GameCode gameCode = new GameCode();
		ActionType type = ActionType.PASS_TURN;
		ActionDto actionDto = this.createActionDto(gameCode, type);
		User otherUser = this.createUser(OTHER_USER_CODE);
		PlayerUsecase playerUsecase = new PlayerUsecase(facade);
		return () -> playerUsecase.performAction(gameCode, otherUser, actionDto);
	}

	private CardCodeDto createCardCodeDto() {
		CardCodeDto cardCodeDto = new CardCodeDto();
		cardCodeDto.setCode(CARD_CODE);
		cardCodeDto.setType(CardType.EQUIPMENT);
		return cardCodeDto;
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
}
