package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.controller.dto.response.ExceptionCodeDto;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.usecase.PlayerUsecase;
import com.dainws.games.crm.usecase.dto.ActionDto;

@RestController
public class WebPlayerController implements PlayerController {

	private User userSession;

	private PlayerUsecase playerUsecase;

	public WebPlayerController(PlayerUsecase playerUsecase) {
		this.playerUsecase = playerUsecase;
	}

	@Override
	public ResponseEntity<ExceptionCodeDto> dispatchAction(String gameCodeBase64UrlSafe, ActionDto actionDto) {
		GameCode gameCode = GameCode.fromBase64UrlSafe(gameCodeBase64UrlSafe);

		ActionResult result = this.playerUsecase.performAction(gameCode, this.userSession.clone(), actionDto);
		if (result.isSuccessful()) {
			return ResponseEntity.ok().build();
		}

		ExceptionCodeDto exceptionCodeDto = new ExceptionCodeDto(result.getExceptionCode().value());
		return ResponseEntity.badRequest().body(exceptionCodeDto);
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
