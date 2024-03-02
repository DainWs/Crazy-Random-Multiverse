package com.dainws.games.cbg.domain.board;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.cbg.domain.exception.ZoneNotFoundException;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.PlayerCode;

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
	
	public Zone getZone(Player player) {
		return this.getZone(player.getPlayerCode());
	}
	
	public Zone getZone(PlayerCode code) {
		if (this.zones.containsKey(code)) {
			return this.zones.get(code);
		}

		throw new ZoneNotFoundException();
	}
	
	public boolean isZoneAlive(PlayerCode code) {
		return this.getZone(code).isAlive();
	}
}
