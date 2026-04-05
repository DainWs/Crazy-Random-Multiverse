package com.dainws.games.crm.controller.dto.domain;

import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public class GameDto {
	@NotNull
	private String code;
	
	@Nullable
	private PlayerDto playerWithTurn;
	
	@NotNull
	private List<ZoneDto> zones;
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getCode() {
		return code;
	}
	
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
