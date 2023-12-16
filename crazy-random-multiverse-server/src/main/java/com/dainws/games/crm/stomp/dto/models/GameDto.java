package com.dainws.games.crm.stomp.dto.models;

import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public class GameDto {
	@Nullable
	private PlayerDto playerWithTurn;
	
	@NotNull
	private List<ZoneDto> zones;
	
	public void setPlayerWithTurn(PlayerDto playerWithTurn) {
		this.playerWithTurn = playerWithTurn;
	}
	
	public PlayerDto getPlayerWithTurn() {
		return playerWithTurn;
	}
	
	public void setZones(List<ZoneDto> zones) {
		this.zones = zones;
	}
	
	public List<ZoneDto> getZones() {
		return zones;
	}
}
