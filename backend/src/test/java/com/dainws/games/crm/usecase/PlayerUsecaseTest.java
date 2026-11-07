package com.dainws.games.crm.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.catchThrowable;

import org.assertj.core.api.ThrowableAssert.ThrowingCallable;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.services.exception.AccessDeniedException;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionType;
import com.dainws.games.crm.usecase.dto.CardCodeDto;
import com.dainws.games.crm.usecase.dto.PositionDto;

class PlayerUsecaseTest {

	private static final String USER_CODE = "user-1";
	private static final String OTHER_USER_CODE = "user-2";
	private static final String CARD_CODE = "42";
	private static final ExceptionCode MALFORMED_REQUEST = new ExceptionCode("request.malformed");

	@Test
	void testGivenEquipAction_whenPerformAction_thenEquipIsPerformed() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionType type = ActionType.EQUIP_ACTION;
		ActionDto actionDto = this.createActionDto(gameCode, type);
		actionDto.setSourceCardCode(this.createCardCodeDto());
		actionDto.setTargetPlayerCode(USER_CODE);
		actionDto.setTargetPosition(new PositionDto());

		PlayerUsecase playerUsecase = new PlayerUsecase(facade);
		User user = this.createUser(USER_CODE);

		playerUsecase.performAction(gameCode, user, actionDto);

		assertThat(facade.getPerformedActions())
				.containsExactly(ActionType.EQUIP_ACTION);
	}

	@Test
	void testGivenSurrenderAction_whenPerformAction_thenSurrenderIsPerformed() {
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
				.isInstanceOf(AccessDeniedException.class);
	}

	@Test
	void testGivenActionOfAnotherGame_whenPerformAction_thenRequestIsMalformed() {
		ActionDto actionDto = this.createActionDto(new GameCode(), ActionType.PASS_TURN);

		ActionResult result = this.performAction(actionDto, new GameCode());

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	@Test
	void testGivenActionOfAnotherGame_whenPerformAction_thenNothingIsPerformed() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		ThrowingCallable performAction = this.performActionOfAnotherGame(facade);

		catchThrowable(performAction);

		assertThat(facade.getPerformedActions()).isEmpty();
	}

	@Test
	void testGivenSourcePlayerOfAnotherUser_whenPerformAction_thenNothingIsPerformed() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		ThrowingCallable performAction = this.performActionOfAnotherUser(facade);

		catchThrowable(performAction);

		assertThat(facade.getPerformedActions()).isEmpty();
	}

	@Test
	void testGivenActionWithoutType_whenPerformAction_thenRequestIsMalformed() {
		GameCode gameCode = new GameCode();
		ActionDto actionDto = this.createActionDto(gameCode, null);

		ActionResult result = this.performAction(actionDto, gameCode);

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	@Test
	void testGivenActionWithoutType_whenPerformAction_thenNothingIsPerformed() {
		RecordingPlayerActionFacade facade = new RecordingPlayerActionFacade();
		GameCode gameCode = new GameCode();
		ActionDto actionDto = this.createActionDto(gameCode, null);
		PlayerUsecase playerUsecase = new PlayerUsecase(facade);
		User user = this.createUser(USER_CODE);

		catchThrowable(() -> playerUsecase.performAction(gameCode, user, actionDto));

		assertThat(facade.getPerformedActions()).isEmpty();
	}

	@Test
	void testGivenPutActionWithoutSourceCard_whenPerformAction_thenRequestIsMalformed() {
		ActionDto actionDto = this.createActionDto(ActionType.PUT_ACTION);
		actionDto.setTargetPosition(new PositionDto());

		ActionResult result = this.performAction(actionDto, this.gameCodeOf(actionDto));

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	@Test
	void testGivenMoveActionWithoutTargetPlayer_whenPerformAction_thenRequestIsMalformed() {
		ActionDto actionDto = this.createActionDto(ActionType.MOVE_ACTION);
		actionDto.setSourcePosition(new PositionDto());
		actionDto.setTargetPosition(new PositionDto());

		ActionResult result = this.performAction(actionDto, this.gameCodeOf(actionDto));

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	@Test
	void testGivenAttackActionWithoutSourcePosition_whenPerformAction_thenRequestIsMalformed() {
		ActionDto actionDto = this.createActionDto(ActionType.ATTACK_ACTION);
		actionDto.setTargetPlayerCode(OTHER_USER_CODE);
		actionDto.setTargetPosition(new PositionDto());

		ActionResult result = this.performAction(actionDto, this.gameCodeOf(actionDto));

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	@Test
	void testGivenEquipActionWithoutTargetPlayer_whenPerformAction_thenRequestIsMalformed() {
		ActionDto actionDto = this.createActionDto(ActionType.EQUIP_ACTION);
		actionDto.setSourceCardCode(this.createCardCodeDto());
		actionDto.setTargetPosition(new PositionDto());

		ActionResult result = this.performAction(actionDto, this.gameCodeOf(actionDto));

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	@Test
	void testGivenActionWithoutSourcePlayer_whenPerformAction_thenRequestIsMalformed() {
		ActionDto actionDto = this.createActionDto(ActionType.PASS_TURN);
		actionDto.setSourcePlayerCode(null);

		ActionResult result = this.performAction(actionDto, this.gameCodeOf(actionDto));

		assertThat(result.getExceptionCode()).isEqualTo(MALFORMED_REQUEST);
	}

	private ActionResult performAction(ActionDto actionDto, GameCode gameCode) {
		PlayerUsecase playerUsecase = new PlayerUsecase(new RecordingPlayerActionFacade());
		return playerUsecase.performAction(gameCode, this.createUser(USER_CODE), actionDto);
	}

	private GameCode gameCodeOf(ActionDto actionDto) {
		return GameCode.from(actionDto.getGameCode());
	}

	private ActionDto createActionDto(ActionType type) {
		return this.createActionDto(new GameCode(), type);
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

	private ThrowingCallable performActionOfAnotherGame(
			RecordingPlayerActionFacade facade) {
		GameCode gameCode = new GameCode();
		ActionDto actionDto = this.createActionDto(new GameCode(), ActionType.PASS_TURN);
		User user = this.createUser(USER_CODE);
		PlayerUsecase playerUsecase = new PlayerUsecase(facade);
		return () -> playerUsecase.performAction(gameCode, user, actionDto);
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
