package com.dainws.games.crm.usecase.dto;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public final class ActionMapper {

	private ActionMapper() {}
	
	public static ActionContextTemplate mapPutActionDto(ActionDto actionDto) {
		PlayerCode playerCode = toPlayerCode(actionDto.getSourcePlayerCode());

		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(toGameCode(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(playerCode);
		contextTemplate.setSourceCardCode(toCardCode(actionDto.getSourceCardCode()));
		contextTemplate.setTargetPlayerCode(playerCode);
		contextTemplate.setTargetCoordinate(toPosition(actionDto.getTargetPosition()));
		return contextTemplate;
	}

	public static ActionContextTemplate mapMoveActionDto(ActionDto actionDto) {
		PlayerCode playerCode = toPlayerCode(actionDto.getSourcePlayerCode());

		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(toGameCode(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(playerCode);
		contextTemplate.setSourceCoordinate(toPosition(actionDto.getSourcePosition()));
		contextTemplate.setTargetPlayerCode(playerCode);
		contextTemplate.setTargetCoordinate(toPosition(actionDto.getTargetPosition()));
		return contextTemplate;
	}

	public static ActionContextTemplate mapAttackActionDto(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(toGameCode(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(toPlayerCode(actionDto.getSourcePlayerCode()));
		contextTemplate.setSourceCoordinate(toPosition(actionDto.getSourcePosition()));
		contextTemplate.setTargetPlayerCode(toPlayerCode(actionDto.getTargetPlayerCode()));
		contextTemplate.setTargetCoordinate(toPosition(actionDto.getTargetPosition()));
		return contextTemplate;
	}

	public static ActionContextTemplate mapPassTurnActionDto(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(toGameCode(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(toPlayerCode(actionDto.getSourcePlayerCode()));
		return contextTemplate;
	}

	public static ActionContextTemplate mapEquipActionDto(ActionDto actionDto) {
		String targetPlayerCode = actionDto.getTargetPlayerCode();
		if (targetPlayerCode == null) {
			targetPlayerCode = actionDto.getSourcePlayerCode();
		}

		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(toGameCode(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(toPlayerCode(actionDto.getSourcePlayerCode()));
		contextTemplate.setSourceCardCode(toCardCode(actionDto.getSourceCardCode()));
		contextTemplate.setTargetPlayerCode(toPlayerCode(targetPlayerCode));
		contextTemplate.setTargetCoordinate(toPosition(actionDto.getTargetPosition()));
		return contextTemplate;
	}

	public static ActionContextTemplate mapSurrenderActionDto(ActionDto actionDto) {
		ActionContextTemplate contextTemplate = new ActionContextTemplate();
		contextTemplate.setGameCode(toGameCode(actionDto.getGameCode()));
		contextTemplate.setSourcePlayerCode(toPlayerCode(actionDto.getSourcePlayerCode()));
		return contextTemplate;
	}

	private static GameCode toGameCode(String gameCodeDto) {
		if (gameCodeDto == null) {
			return null;
		}

		return GameCode.from(gameCodeDto);
	}

	private static PlayerCode toPlayerCode(String playerCodeDto) {
		if (playerCodeDto == null) {
			return null;
		}

		return PlayerCode.from(playerCodeDto);
	}

	private static CardCode toCardCode(CardCodeDto dto) {
		if (dto == null) {
			return null;
		}

		return CardCode.from(dto.getCode(), dto.getType());
	}

	private static Coordinate toPosition(PositionDto dto) {
		if (dto == null) {
			return null;
		}

		return new Coordinate(dto.getRow(), dto.getColumn());
	}
}
