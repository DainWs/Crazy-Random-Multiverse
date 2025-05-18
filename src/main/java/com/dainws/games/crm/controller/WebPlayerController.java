package com.dainws.games.crm.controller;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.controller.dto.ActionMapper;
import com.dainws.games.crm.controller.dto.domain.ActionDto;
import com.dainws.games.crm.controller.dto.domain.ActionType;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;

@RestController
public class WebPlayerController implements PlayerController {

	private User userSession;
	private PlayerActionFacade playerActionFacade;
	private Map<ActionType, Consumer<ActionDto>> actionResolver;

	public WebPlayerController(PlayerActionFacade playerActionFacade) {
		this.playerActionFacade = playerActionFacade;
		this.actionResolver = new EnumMap<>(ActionType.class);
		this.actionResolver.put(ActionType.PUT_ACTION, this::putAction);
		this.actionResolver.put(ActionType.MOVE_ACTION, this::moveAction);
		this.actionResolver.put(ActionType.ATTACK_ACTION, this::attackAction);
		this.actionResolver.put(ActionType.PASS_TURN, this::passTurnAction);
	}
	
	@Override
	public void dispatchAction(String gameCodeAsString, ActionDto actionDto) throws IllegalAccessException {
		if (!gameCodeAsString.contentEquals(actionDto.getGameCode())) {
			throw new IllegalAccessException("Acceso denegado - intento de acceso al juego incorrecto");
		}
		
		if (!userSession.getCode().text().contentEquals(actionDto.getSourcePlayerCode())) {
			throw new IllegalAccessException("Acceso denegado - intento de suplantación de indentidad detectado");
		}
		
		this.actionResolver.get(actionDto.getType())
				.accept(actionDto);
	}
	
	private void putAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionMapper().mapPutActionDto(actionDto);
		this.playerActionFacade.playerPutCard(contextTemplate);
	}
	
	private void moveAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionMapper().mapMoveActionDto(actionDto);
		this.playerActionFacade.playerMoveCard(contextTemplate);
	}
	
	private void attackAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionMapper().mapAttackActionDto(actionDto);
		this.playerActionFacade.playerAttackCard(contextTemplate);
	}
	
	private void passTurnAction(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionMapper().mapPassTurnActionDto(actionDto);
		this.playerActionFacade.playerPassTurn(contextTemplate);
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
