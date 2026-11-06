package com.dainws.games.crm.domain.mode.classic;

import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;

public class AttackAvailabilityRecorder implements EventPublisher {

	private final Combatant combatant;
	private boolean canAttackAtTurnChange;

	public AttackAvailabilityRecorder(Combatant combatant) {
		this.combatant = combatant;
	}

	@Override
	public void publish(EventCode code) {
		this.record(code);
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.record(code);
	}

	@Override
	public void publish(Event event) {
		this.record(event.getCode());
	}

	public boolean getCanAttackAtTurnChange() {
		return this.canAttackAtTurnChange;
	}

	private void record(EventCode code) {
		if (code == EventCode.TURN_CHANGE) {
			this.canAttackAtTurnChange = this.combatant.canAttack();
		}
	}
}
