package com.dainws.games.crm.tools.domain.core.board;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.statistics.Health;

public class DummyZone extends Zone {

	public DummyZone() {
		super(3, 3);
	}
	
	public DummyZone(int horizontalDimension, int verticalDimension) {
		super(horizontalDimension, verticalDimension);
	}

	@Override
	public boolean isAlive() {
		return this.hasCombatants();
	}

	@Override
	public Health getZoneHealth() {
		return Health.newInstance(this.countCombatants(), this.getCapacity());
	}
}
