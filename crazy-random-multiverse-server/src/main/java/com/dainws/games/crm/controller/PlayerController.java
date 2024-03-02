package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.ActionService;
import com.dainws.games.cbg.domain.action.ActionContextTemplate;
import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.crm.controller.dto.ActionDto;
import com.dainws.games.crm.controller.dto.ActionMapper;

@Controller
public class PlayerController {

	private ActionService actionService;

	public PlayerController(ActionService actionService) {
		this.actionService = actionService;
	}

	@MessageMapping("/game/{gameCode}/player/put-card")
	public void putCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload ActionDto actionDto
	) {
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapPutActionDto(actionDto);
		this.actionService.playerPutCard(contextTemplate);
	}
	
	@MessageMapping("/game/{gameCode}/player/move-card")
	public void moveCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload ActionDto actionDto
	) {
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapMoveActionDto(actionDto);
		this.actionService.playerMoveCard(contextTemplate);
	}
	
	@MessageMapping("/game/{gameCode}/player/attack-card")
	public void attackCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload ActionDto actionDto
	) {
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapAttackActionDto(actionDto);
		this.actionService.playerAttackCard(contextTemplate);
	}
	
	@MessageMapping("/game/{gameCode}/player/equip-card")
	public void equipCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload ActionDto actionDto
	) {
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapEquipActionDto(actionDto);
		this.actionService.playerEquipCard(contextTemplate);
	}
	
	@MessageMapping("/game/{gameCode}/player/surrender")
	public void surrenderCard(
			@Header(value = "simpSessionId") String agentCode,
			@DestinationVariable(value = "gameCode") String gameCodeAsString
	) {
		ActionDto actionDto = new ActionDto();
		actionDto.setGameCode(gameCodeAsString);
		actionDto.setSourcePlayerCode(agentCode);
		
		ActionContextTemplate contextTemplate = new ActionMapper().mapSurrenderActionDto(actionDto);
		this.actionService.playerSurrender(contextTemplate);
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
