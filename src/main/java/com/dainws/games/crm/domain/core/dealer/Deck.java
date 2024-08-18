package com.dainws.games.crm.domain.core.dealer;

import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

public interface Deck {
	Warrior drawWarrior(WarriorRarity rarity);

	Equipment drawEquipment();

	Leader drawLeader();

	Spell drawSpell();
}
