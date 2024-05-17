package com.dainws.games.crm.domain.models.card;

import com.dainws.games.crm.domain.models.card.Warrior;

public class WarriorFactory {
	public Warrior createBasicWarrior() {
		return this.createWarriorWithoutDamageAndArmor();
	}
	
	public Warrior createWarriorWithoutDamageAndArmor() {
		return Warrior.commonWarriorBuilder()
				.withCode(1L)
				.withName("test-warrior")
				.withDescription("test-warrior_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(100)
				.build();
	}
}
