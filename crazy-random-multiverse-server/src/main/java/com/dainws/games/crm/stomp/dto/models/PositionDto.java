package com.dainws.games.crm.stomp.dto.models;

import com.dainws.games.cbg.domain.player.LinePosition;
import com.dainws.games.cbg.domain.player.SquarePosition;

import jakarta.validation.constraints.NotNull;

public class PositionDto {
	@NotNull
	private LinePosition linePosition;

	@NotNull
	private SquarePosition squarePosition;

	public LinePosition getLinePosition() {
		return linePosition;
	}

	public void setLinePosition(LinePosition linePosition) {
		this.linePosition = linePosition;
	}

	public SquarePosition getSquarePosition() {
		return squarePosition;
	}

	public void setSquarePosition(SquarePosition squarePosition) {
		this.squarePosition = squarePosition;
	}
}
