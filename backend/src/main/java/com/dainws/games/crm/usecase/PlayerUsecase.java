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

		String userCode = user.getCode().text();
		if (!userCode.contentEquals(actionDto.getSourcePlayerCode())) {
			throw AccessDeniedException.identityMismatch();
		}

		return this.actionResolver.get(actionDto.getType())
				.apply(actionDto);
	}

	private boolean hasCommonFields(GameCode gameCode, ActionDto actionDto) {
		boolean hasType = actionDto.getType() != null;
		boolean hasSourcePlayer = actionDto.getSourcePlayerCode() != null;
		boolean hasGame = actionDto.getGameCode() != null;
		boolean hasAllFields = hasType && hasSourcePlayer && hasGame;

		return hasAllFields && gameCode.text().contentEquals(actionDto.getGameCode());
	}

	private ActionResult putAction(ActionDto actionDto) {
		if (this.isMalformedPut(actionDto)) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapPutActionDto(actionDto);
		return this.actionFacade.playerPutCard(contextTemplate);
	}

	private boolean isMalformedPut(ActionDto actionDto) {
		boolean hasSourceCard = actionDto.getSourceCardCode() != null;
		boolean hasTargetPosition = actionDto.getTargetPosition() != null;

		return !(hasSourceCard && hasTargetPosition);
	}
	
	private ActionResult moveAction(ActionDto actionDto) {
		if (this.isMalformedMove(actionDto)) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapMoveActionDto(actionDto);
		return this.actionFacade.playerMoveCard(contextTemplate);
	}

	private boolean isMalformedMove(ActionDto actionDto) {
		boolean hasSourcePosition = actionDto.getSourcePosition() != null;
		boolean hasTargetPlayer = actionDto.getTargetPlayerCode() != null;
		boolean hasTargetPosition = actionDto.getTargetPosition() != null;

		return !(hasSourcePosition && hasTargetPlayer && hasTargetPosition);
	}
	
	private ActionResult attackAction(ActionDto actionDto) {
		if (this.isMalformedAttack(actionDto)) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapAttackActionDto(actionDto);
		return this.actionFacade.playerAttackCard(contextTemplate);
	}

	private boolean isMalformedAttack(ActionDto actionDto) {
		boolean hasSourcePosition = actionDto.getSourcePosition() != null;
		boolean hasTargetPlayer = actionDto.getTargetPlayerCode() != null;
		boolean hasTargetPosition = actionDto.getTargetPosition() != null;

		return !(hasSourcePosition && hasTargetPlayer && hasTargetPosition);
	}
	
	private ActionResult equipAction(ActionDto actionDto) {
		if (this.isMalformedEquip(actionDto)) {
			return ActionResult.failed(MALFORMED_REQUEST);
		}

		ActionContextTemplate contextTemplate = ActionMapper.mapEquipActionDto(actionDto);
		return this.actionFacade.playerEquipCard(contextTemplate);
	}

	private boolean isMalformedEquip(ActionDto actionDto) {
		boolean hasSourceCard = actionDto.getSourceCardCode() != null;
		boolean hasTargetPlayer = actionDto.getTargetPlayerCode() != null;
		boolean hasTargetPosition = actionDto.getTargetPosition() != null;

		return !(hasSourceCard && hasTargetPlayer && hasTargetPosition);
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
