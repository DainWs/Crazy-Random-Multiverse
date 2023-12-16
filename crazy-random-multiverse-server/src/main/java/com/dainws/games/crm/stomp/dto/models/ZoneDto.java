package com.dainws.games.crm.stomp.dto.models;

import java.util.Map;

import jakarta.validation.constraints.NotNull;

public class ZoneDto {
	@NotNull
	private PlayerDto owner;
	
	@NotNull
	private Map<PositionDto, CardDto> positions;
	
	public void setOwner(PlayerDto owner) {
		this.owner = owner;
	}
	
	public PlayerDto getOwner() {
		return owner;
	}
	
	public void setPositions(Map<PositionDto, CardDto> positions) {
		this.positions = positions;
	}
	
	public Map<PositionDto, CardDto> getPositions() {
		return positions;
	}
}
