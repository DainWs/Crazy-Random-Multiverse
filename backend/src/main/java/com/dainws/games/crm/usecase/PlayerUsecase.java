package com.dainws.games.crm.usecase;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.services.exception.AccessDeniedException;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionMapper;
import com.dainws.games.crm.usecase.dto.ActionType;

@Component
public class PlayerUsecase {

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
		if (!gameCode.text().contentEquals(actionDto.getGameCode())) {
			throw AccessDeniedException.wrongGame();
		}

		if (!user.getCode().text().contentEquals(actionDto.getSourcePlayerCode())) {
			throw AccessDeniedException.identityMismatch();
		}

		if (!this.actionResolver.containsKey(actionDto.getType())) {
			throw new IllegalArgumentException("There is no handler for the action type " + actionDto.getType());
		}

		return this.actionResolver.get(actionDto.getType())
				.apply(actionDto);
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
