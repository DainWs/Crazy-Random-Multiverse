package com.dainws.games.crm.domain.core.board;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.exception.ZoneNotFoundException;

public class Board {

	private Map<PlayerCode, Zone> zones;
	
	public Board(List<Player> players) {
		this.zones = new HashMap<>();
		
		for (Player player : players) {
			if (!player.isSpectator()) {
				this.setZone(player, new ZoneWithLeader());
			}
		}
	}
	
	public void setZone(Player player, Zone zone) {
		assert(!player.isSpectator());
		
		this.zones.put(player.getPlayerCode(), zone);
	}
	
	public boolean hasZoneOf(Player player) {
		return this.hasZoneOf(player.getPlayerCode());
	}
	
	public boolean hasZoneOf(PlayerCode code) {
		return this.zones.containsKey(code);
	}
	
	public Zone getZoneOf(Player player) {
		return this.getZoneOf(player.getPlayerCode());
	}
	
	public Zone getZoneOf(PlayerCode code) {
		if (this.zones.containsKey(code)) {
			return this.zones.get(code);
		}

		throw new ZoneNotFoundException();
	}
	
	public boolean isZoneAlive(PlayerCode code) {
		return this.getZoneOf(code).isAlive();
	}
}
