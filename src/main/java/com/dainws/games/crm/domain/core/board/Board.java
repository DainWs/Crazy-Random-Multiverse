package com.dainws.games.crm.domain.core.board;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class Board {

	private Map<PlayerCode, Zone> zones;
	
	public Board(Collection<Player> players) {
		this(ZoneWithLeader::new, players);
	}
	
	public Board(ZoneFactory zoneFactory, Collection<Player> players) {
		this.zones = new HashMap<>();
		
		for (Player player : players) {
			if (!player.isSpectator()) {
				this.setZone(player, zoneFactory.create());
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
	
	public Zone getZoneOf(PlayerCode code) throws NotFoundException {
		if (this.zones.containsKey(code)) {
			return this.zones.get(code);
		}

		throw NotFoundException.zoneNotFound();
	}
	
	public boolean isZoneAlive(PlayerCode code) {
		return this.getZoneOf(code).isAlive();
	}
}
