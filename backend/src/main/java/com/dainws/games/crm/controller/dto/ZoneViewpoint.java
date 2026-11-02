package com.dainws.games.crm.controller.dto;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Player;

class ZoneViewpoint {

	private final Zone zone;
	private final boolean viewerCanAct;
	private final boolean viewerCanTarget;

	ZoneViewpoint(Game game, Zone zone, Player viewer) {
		boolean isEnemyZone = zone.isEnemy(viewer);
		this.zone = zone;
		this.viewerCanAct = !isEnemyZone && game.canAct(viewer);
		this.viewerCanTarget = isEnemyZone && !viewer.isSpectator();
	}

	boolean canAttackFrom(Coordinate coordinate) {
		return this.viewerCanAct && this.zone.canAttackFrom(coordinate);
	}

	boolean canTarget(Coordinate coordinate) {
		return this.viewerCanTarget && this.zone.canBeTargeted(coordinate);
	}
}
