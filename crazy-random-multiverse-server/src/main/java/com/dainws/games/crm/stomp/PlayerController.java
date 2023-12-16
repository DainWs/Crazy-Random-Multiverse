package com.dainws.games.crm.stomp;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.player.PlayerCode;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.crm.game.ActionContextTemplate;
import com.dainws.games.crm.services.PlayerFacade;
import com.dainws.games.crm.stomp.dto.PlayerPutCardRequest;
import com.dainws.games.crm.stomp.dto.models.CardCodeDto;
import com.dainws.games.crm.stomp.dto.models.PositionDto;

@Controller
public class PlayerController {

	private PlayerFacade playerFacade;

	public PlayerController(PlayerFacade playerFacade) {
		this.playerFacade = playerFacade;
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
		contextTemplate.setTargetPosition(this.mapPositionDto(putCardRequest.getTargetPosition()));

		this.playerFacade.playerPutCard(contextTemplate);
	}

	private CardCode mapCardCodeDto(CardCodeDto dto) {
		return new CardCode(dto.getCode(), dto.getType());
	}

	private Position mapPositionDto(PositionDto dto) {
		return new Position(dto.getLinePosition(), dto.getSquarePosition());
	}
}
