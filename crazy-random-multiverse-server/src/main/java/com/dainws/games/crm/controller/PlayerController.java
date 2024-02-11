package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.ActionService;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.action.ActionContextTemplate;
import com.dainws.games.cbg.domain.board.Coordinate;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.player.PlayerCode;
import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.crm.controller.dto.PlayerPutCardRequest;
import com.dainws.games.crm.controller.dto.models.CardCodeDto;
import com.dainws.games.crm.controller.dto.models.PositionDto;

@Controller
public class PlayerController {

	private ActionService actionService;

	public PlayerController(ActionService actionService) {
		this.actionService = actionService;
	}

	@MessageMapping("/game/{gameCode}/player/put-card")
	public void playerPutCard(@Header(value = "simpSessionId") String sessionId,
			@DestinationVariable(value = "gameCode") String gameCodeAsString, 
			@Payload PlayerPutCardRequest putCardRequest) {
		GameCode gameCode = GameCode.fromString(gameCodeAsString);
		PlayerCode playerCode = PlayerCode.from(sessionId);

		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(gameCode);
		contextTemplate.setSourcePlayerCode(playerCode);
		contextTemplate.setSourceCardCode(this.mapCardCodeDto(putCardRequest.getSourceCardCode()));
		contextTemplate.setTargetPlayerCode(playerCode);
		contextTemplate.setTargetCoordinate(this.mapPositionDto(putCardRequest.getTargetPosition()));

		this.actionService.playerPutCard(contextTemplate);
	}
	
	@MessageExceptionHandler
	@SendToUser("/topic/error")
	public String handleException(Throwable exception) {
		if (exception instanceof Translatable) {
			return ((Translatable)exception).getKey().getValue();
		}

		return exception.getMessage();
	}

	private CardCode mapCardCodeDto(CardCodeDto dto) {
		return new CardCode(dto.getCode(), dto.getType());
	}

	private Coordinate mapPositionDto(PositionDto dto) {
		return new Coordinate(dto.getRow(), dto.getColumn());
	}
}
