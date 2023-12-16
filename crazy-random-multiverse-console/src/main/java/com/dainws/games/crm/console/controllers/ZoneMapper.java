package com.dainws.games.crm.console.controllers;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.player.Line;
import com.dainws.games.cbg.domain.player.Square;
import com.dainws.games.cbg.domain.player.Zone;
import com.dainws.games.crm.console.controllers.dto.CombatantDto;
import com.dainws.games.crm.console.controllers.dto.LineDto;
import com.dainws.games.crm.console.controllers.dto.SquareDto;
import com.dainws.games.crm.console.controllers.dto.ZoneDto;

public class ZoneMapper {

	public ZoneDto map(Zone zone) {
		ZoneDto zoneDto = new ZoneDto();
		for (Line line : zone.getLines()) {
			zoneDto.addLine(this.mapToLineDto(line));
		}

		return zoneDto;
	}
	
	private LineDto mapToLineDto(Line line) {
		LineDto lineDto = new LineDto(line.getLinePosition());
		for (Square square : line.getSquares()) {
			lineDto.add(this.mapToSquareDto(square));
		}

		return lineDto;
	}
	
	private SquareDto mapToSquareDto(Square square) {
		SquareDto squareDto = new SquareDto(square.getPosition().getSquarePosition());
		if (square.hasCombatant()) {
			Combatant combatant = square.getCombatant();
			CombatantDto combatantDto = new CardMapper().mapCombatant(combatant);
			squareDto.setCombatantDto(combatantDto);
		}

		return squareDto;
	}
}
