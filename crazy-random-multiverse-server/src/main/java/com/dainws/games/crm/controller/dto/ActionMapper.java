package com.dainws.games.crm.controller.dto;

import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.action.ActionContextTemplate;
import com.dainws.games.cbg.domain.board.Coordinate;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.player.PlayerCode;
import com.dainws.games.crm.controller.dto.models.ActionDto;
import com.dainws.games.crm.controller.dto.models.CardCodeDto;
import com.dainws.games.crm.controller.dto.models.PositionDto;

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
		return GameCode.fromString(gameCodeDto);
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
