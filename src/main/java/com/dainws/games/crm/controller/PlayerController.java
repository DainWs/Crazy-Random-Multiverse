package com.dainws.games.crm.controller;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.controller.dto.ActionMapper;
import com.dainws.games.crm.controller.dto.domain.ActionDto;
import com.dainws.games.crm.controller.dto.domain.ActionType;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.domain.translator.Translatable;
// TODO go frontend, and fix contract
@Controller
public class PlayerController {

	private PlayerActionFacade playerActionFacade;
	private Map<ActionType, Consumer<ActionDto>> actionResolver;

	public PlayerController(PlayerActionFacade playerActionFacade) {
		this.playerActionFacade = playerActionFacade;
		this.actionResolver = new EnumMap<>(ActionType.class);
		this.actionResolver.put(ActionType.PUT_ACTION, this::putAction);
		this.actionResolver.put(ActionType.MOVE_ACTION, this::moveAction);
		this.actionResolver.put(ActionType.ATTACK_ACTION, this::attackAction);
	}
	
	@MessageMapping("/game/{gameCode}/action")
	public void dispatchAction(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload ActionDto actionDto
	) throws IllegalAccessException {
		if (!gameCodeAsString.contentEquals(actionDto.getGameCode())) {
			throw new IllegalAccessException("Acceso denegado - intento de acceso al juego incorrecto");
		}
		
		if (!agentCode.contentEquals(actionDto.getSourcePlayerCode())) {
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
	
	@Deprecated
	@MessageMapping("/game/{gameCode}/player/equip-card")
	public void equipCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload ActionDto actionDto
	) {
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapEquipActionDto(actionDto);
		this.playerActionFacade.playerEquipCard(contextTemplate);
	}
	
	@Deprecated
	@MessageMapping("/game/{gameCode}/player/surrender")
	public void surrenderCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString
	) {
		ActionDto actionDto = new ActionDto();
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapSurrenderActionDto(actionDto);
		this.playerActionFacade.playerSurrender(contextTemplate);
	}
	
	@MessageExceptionHandler
	@SendToUser("/topic/error")
	public String handleException(Throwable exception) {
		if (exception instanceof Translatable) {
			return ((Translatable)exception).getKey().getValue();
		}

		return exception.getMessage();
	}
}
