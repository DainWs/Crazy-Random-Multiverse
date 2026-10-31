package com.dainws.games.crm.usecase.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.player.PlayerCode;

class ActionMapperTest {

	private static final String PLAYER_CODE = "player-1";
	private static final String TARGET_PLAYER_CODE = "player-2";

	@Test
	void testGivenPassTurnDto_whenMap_thenSourcePlayerIsTheDtoPlayer() {
		ActionDto actionDto = this.createActionDto();

		ActionContextTemplate template = ActionMapper.mapPassTurnActionDto(actionDto);

		assertThat(template.getSourcePlayerCode()).isEqualTo(PlayerCode.from(PLAYER_CODE));
	}

	@Test
	void testGivenAttackDto_whenMap_thenTargetPlayerIsTheDtoPlayer() {
		ActionDto actionDto = this.createActionDto();
		actionDto.setTargetPlayerCode(TARGET_PLAYER_CODE);
		actionDto.setSourcePosition(new PositionDto());
		actionDto.setTargetPosition(new PositionDto());

		ActionContextTemplate template = ActionMapper.mapAttackActionDto(actionDto);

		assertThat(template.getTargetPlayerCode()).isEqualTo(PlayerCode.from(TARGET_PLAYER_CODE));
	}

	@Test
	void testGivenEquipDtoWithoutTargetPlayer_whenMap_thenTargetPlayerIsSourcePlayer() {
		ActionDto actionDto = this.createActionDto();
		actionDto.setSourceCardCode(new CardCodeDto());
		actionDto.setTargetPosition(new PositionDto());

		ActionContextTemplate template = ActionMapper.mapEquipActionDto(actionDto);

		assertThat(template.getTargetPlayerCode()).isEqualTo(PlayerCode.from(PLAYER_CODE));
	}

	@Test
	void testGivenSurrenderDto_whenMap_thenSourcePlayerIsTheDtoPlayer() {
		ActionDto actionDto = this.createActionDto();

		ActionContextTemplate template = ActionMapper.mapSurrenderActionDto(actionDto);

		assertThat(template.getSourcePlayerCode()).isEqualTo(PlayerCode.from(PLAYER_CODE));
	}

	private ActionDto createActionDto() {
		ActionDto actionDto = new ActionDto();
		actionDto.setGameCode(new GameCode().text());
		actionDto.setSourcePlayerCode(PLAYER_CODE);
		return actionDto;
	}
}
