package com.dainws.games.crm.usecase;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;

import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.services.exception.AccessDeniedException;
import com.dainws.games.crm.services.exception.MalformedRequestException;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionMapper;
import com.dainws.games.crm.usecase.dto.ActionType;

@Component
public class PlayerUsecase {

	private PlayerActionFacade actionFacade;
	private Map<ActionType, Function<ActionDto, ActionResult>> actionResolver;
	private Map<ActionType, Predicate<ActionDto>> requiredFieldsCheck;

	public PlayerUsecase(PlayerActionFacade playerActionFacade) {
		this.actionFacade = playerActionFacade;
		this.actionResolver = new EnumMap<>(ActionType.class);
		this.actionResolver.put(ActionType.PUT_ACTION, this::putAction);
		this.actionResolver.put(ActionType.MOVE_ACTION, this::moveAction);
		this.actionResolver.put(ActionType.ATTACK_ACTION, this::attackAction);
		this.actionResolver.put(ActionType.EQUIP_ACTION, this::equipAction);
		this.actionResolver.put(ActionType.SURRENDER_ACTION, this::surrenderAction);
		this.actionResolver.put(ActionType.PASS_TURN, this::passTurnAction);

		this.requiredFieldsCheck = new EnumMap<>(ActionType.class);
		this.requiredFieldsCheck.put(ActionType.PUT_ACTION, this::hasPutFields);
		this.requiredFieldsCheck.put(ActionType.MOVE_ACTION, this::hasMoveOrAttackFields);
		this.requiredFieldsCheck.put(ActionType.ATTACK_ACTION, this::hasMoveOrAttackFields);
		this.requiredFieldsCheck.put(ActionType.EQUIP_ACTION, this::hasEquipFields);
		this.requiredFieldsCheck.put(ActionType.SURRENDER_ACTION, actionDto -> true);
		this.requiredFieldsCheck.put(ActionType.PASS_TURN, actionDto -> true);
	}


	public ActionResult performAction(GameCode gameCode, User user, ActionDto actionDto) {
		if (!this.isWellFormed(gameCode, actionDto)) {
			throw new MalformedRequestException();
		}

		if (!user.getCode().text().contentEquals(actionDto.getSourcePlayerCode())) {
			throw AccessDeniedException.identityMismatch();
		}

		return this.actionResolver.get(actionDto.getType())
				.apply(actionDto);
	}

	private boolean isWellFormed(GameCode gameCode, ActionDto actionDto) {
		if (actionDto.getType() == null || actionDto.getGameCode() == null || actionDto.getSourcePlayerCode() == null) {
			return false;
		}

		if (!gameCode.text().contentEquals(actionDto.getGameCode())) {
			return false;
		}

		return this.requiredFieldsCheck.get(actionDto.getType()).test(actionDto);
	}

	private boolean hasPutFields(ActionDto actionDto) {
		return actionDto.getSourceCardCode() != null && actionDto.getTargetPosition() != null;
	}

	private boolean hasMoveOrAttackFields(ActionDto actionDto) {
		return actionDto.getSourcePosition() != null
				&& actionDto.getTargetPlayerCode() != null
				&& actionDto.getTargetPosition() != null;
	}

	private boolean hasEquipFields(ActionDto actionDto) {
		return actionDto.getSourceCardCode() != null
				&& actionDto.getTargetPlayerCode() != null
				&& actionDto.getTargetPosition() != null;
	}

	private ActionResult putAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapPutActionDto(actionDto);
		return this.actionFacade.playerPutCard(contextTemplate);
	}

	private ActionResult moveAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapMoveActionDto(actionDto);
		return this.actionFacade.playerMoveCard(contextTemplate);
	}

	private ActionResult attackAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapAttackActionDto(actionDto);
		return this.actionFacade.playerAttackCard(contextTemplate);
	}

	private ActionResult equipAction(ActionDto actionDto) {
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
