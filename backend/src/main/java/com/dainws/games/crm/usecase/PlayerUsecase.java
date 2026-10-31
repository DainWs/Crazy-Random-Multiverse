package com.dainws.games.crm.usecase;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionMapper;
import com.dainws.games.crm.usecase.dto.ActionType;

@Component
public class PlayerUsecase {

	private PlayerActionFacade actionFacade;
	private Map<ActionType, Consumer<ActionDto>> actionResolver;
	
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
	
	
	public void performAction(GameCode gameCode, User user, ActionDto actionDto) throws IllegalAccessException {
		if (!gameCode.text().contentEquals(actionDto.getGameCode())) {
			throw new IllegalAccessException("Acceso denegado - intento de acceso al juego incorrecto");
		}

		if (!user.getCode().text().contentEquals(actionDto.getSourcePlayerCode())) {
			throw new IllegalAccessException("Acceso denegado - intento de suplantación de indentidad detectado");
		}

		this.actionResolver.get(actionDto.getType())
				.accept(actionDto);
	}

	private void putAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapPutActionDto(actionDto);
		this.actionFacade.playerPutCard(contextTemplate);
	}
	
	private void moveAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapMoveActionDto(actionDto);
		this.actionFacade.playerMoveCard(contextTemplate);
	}
	
	private void attackAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapAttackActionDto(actionDto);
		this.actionFacade.playerAttackCard(contextTemplate);
	}
	
	private void equipAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapEquipActionDto(actionDto);
		this.actionFacade.playerEquipCard(contextTemplate);
	}

	private void surrenderAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapSurrenderActionDto(actionDto);
		this.actionFacade.playerSurrender(contextTemplate);
	}

	private void passTurnAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = ActionMapper.mapPassTurnActionDto(actionDto);
		this.actionFacade.playerPassTurn(contextTemplate);
	}
}
