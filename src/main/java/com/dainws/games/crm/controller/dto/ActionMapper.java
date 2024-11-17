package com.dainws.games.crm.controller.dto;

import com.dainws.games.crm.controller.dto.domain.ActionDto;
import com.dainws.games.crm.controller.dto.domain.CardCodeDto;
import com.dainws.games.crm.controller.dto.domain.PositionDto;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class ActionMapper {

	public ActionContextTemplate mapPutActionDto(ActionDto actionDto) {
		PlayerCode playerCode = this.mapPlayerCodeDto(actionDto.getSourcePlayerCode());

		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(this.mapGameCodeDto(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(playerCode);
		contextTemplate.setSourceCardCode(this.mapCardCodeDto(actionDto.getSourceCardCode()));
		contextTemplate.setTargetPlayerCode(playerCode);
		contextTemplate.setTargetCoordinate(this.mapPositionDto(actionDto.getTargetPosition()));
		return contextTemplate;
	}

	public ActionContextTemplate mapMoveActionDto(ActionDto actionDto) {
		PlayerCode playerCode = this.mapPlayerCodeDto(actionDto.getSourcePlayerCode());

		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(this.mapGameCodeDto(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(playerCode);
		contextTemplate.setSourceCoordinate(this.mapPositionDto(actionDto.getSourcePosition()));
		contextTemplate.setTargetPlayerCode(playerCode);
		contextTemplate.setTargetCoordinate(this.mapPositionDto(actionDto.getTargetPosition()));
		return contextTemplate;
	}

	public ActionContextTemplate mapAttackActionDto(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(this.mapGameCodeDto(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(this.mapPlayerCodeDto(actionDto.getSourcePlayerCode()));
		contextTemplate.setSourceCoordinate(this.mapPositionDto(actionDto.getSourcePosition()));
		contextTemplate.setTargetPlayerCode(this.mapPlayerCodeDto(actionDto.getTargetPlayerCode()));
		contextTemplate.setTargetCoordinate(this.mapPositionDto(actionDto.getTargetPosition()));
		return contextTemplate;
	}
	
	public ActionContextTemplate mapEquipActionDto(ActionDto actionDto) {
		String targetPlayerCode = actionDto.getTargetPlayerCode();
		if (targetPlayerCode == null) {
			targetPlayerCode = actionDto.getSourcePlayerCode();
		}
		
		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(this.mapGameCodeDto(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(this.mapPlayerCodeDto(actionDto.getSourcePlayerCode()));
		contextTemplate.setSourceCardCode(this.mapCardCodeDto(actionDto.getSourceCardCode()));
		contextTemplate.setTargetPlayerCode(this.mapPlayerCodeDto(targetPlayerCode));
		contextTemplate.setTargetCoordinate(this.mapPositionDto(actionDto.getTargetPosition()));
		return contextTemplate;
	}
	
	public ActionContextTemplate mapSurrenderActionDto(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(this.mapGameCodeDto(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(this.mapPlayerCodeDto(actionDto.getSourcePlayerCode()));
		return contextTemplate;
	}

	private GameCode mapGameCodeDto(String gameCodeDto) {
		return GameCode.from(gameCodeDto);
	}
	
	private PlayerCode mapPlayerCodeDto(String playerCodeDto) {
		return PlayerCode.from(playerCodeDto);
	}

	private CardCode mapCardCodeDto(CardCodeDto dto) {
		return new CardCode(dto.getCode(), dto.getType());
	}

	private Coordinate mapPositionDto(PositionDto dto) {
		return new Coordinate(dto.getRow(), dto.getColumn());
	}
}
