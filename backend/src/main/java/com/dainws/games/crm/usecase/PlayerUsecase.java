package com.dainws.games.crm.usecase;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.services.exception.AccessDeniedException;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionMapper;
import com.dainws.games.crm.usecase.dto.ActionType;

@Component
public class PlayerUsecase {

	private static final ExceptionCode MALFORMED_REQUEST = new ExceptionCode("request.malformed");

	private PlayerActionFacade actionFacade;
	private Map<ActionType, Function<ActionDto, ActionResult>> actionResolver;
	
	public PlayerUsecase(PlayerActionFacade playerActionFacade) {
		this.actionFacade = playerActionFacade;
		this.actionResolver = new EnumMap<>(ActionType.class);
		this.actionResolver.put(ActionType.PUT_ACTION, this::putAction);
		this.actionResolver.put(ActionType.MOVE_ACTION, this::moveAction);
		this.actionResolver.put(ActionType.ATTACK_ACTION, this::attackAction);
		this.actionResolver.put(ActionType.EQUIP_ACTION, this::equipAction);
		this.actionResolver.put(ActionType.SURRENDER_ACTION, this::surrenderAction);
		this.actionResolver.put(ActionType.PASS_TURN, this::passTurnAction);
	}
	
	
	public ActionResult performAction(GameCode gameCode, User user, ActionDto actionDto) {
		if (!this.hasCommonFields(gameCode, actionDto)) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		if (!user.getCode().text().contentEquals(actionDto.getSourcePlayerCode())) {
			throw AccessDeniedException.identityMismatch();
		}

		return this.actionResolver.get(actionDto.getType())
				.apply(actionDto);
	}

	private boolean hasCommonFields(GameCode gameCode, ActionDto actionDto) {
		return actionDto.getType() != null
				&& actionDto.getSourcePlayerCode() != null
				&& actionDto.getGameCode() != null
				&& gameCode.text().contentEquals(actionDto.getGameCode());
	}

	private ActionResult putAction(ActionDto actionDto) {
		if (actionDto.getSourceCardCode() == null || actionDto.getTargetPosition() == null) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapPutActionDto(actionDto);
		return this.actionFacade.playerPutCard(contextTemplate);
	}
	
	private ActionResult moveAction(ActionDto actionDto) {
		if (actionDto.getSourcePosition() == null || actionDto.getTargetPlayerCode() == null || actionDto.getTargetPosition() == null) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapMoveActionDto(actionDto);
		return this.actionFacade.playerMoveCard(contextTemplate);
	}
	
	private ActionResult attackAction(ActionDto actionDto) {
		if (actionDto.getSourcePosition() == null || actionDto.getTargetPlayerCode() == null || actionDto.getTargetPosition() == null) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapAttackActionDto(actionDto);
		return this.actionFacade.playerAttackCard(contextTemplate);
	}
	
	private ActionResult equipAction(ActionDto actionDto) {
		if (actionDto.getSourceCardCode() == null || actionDto.getTargetPlayerCode() == null || actionDto.getTargetPosition() == null) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapEquipActionDto(actionDto);
		return this.actionFacade.playerEquipCard(contextTemplate);
	}

	private ActionResult surrenderAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapSurrenderActionDto(actionDto);
		return this.actionFacade.playerSurrender(contextTemplate);
	}

	private ActionResult passTurnAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapPassTurnActionDto(actionDto);
		return this.actionFacade.playerPassTurn(contextTemplate);
	}
}
