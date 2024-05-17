package com.dainws.games.crm.domain.models.dealer;

import com.dainws.games.crm.domain.models.card.Equipment;
import com.dainws.games.crm.domain.models.card.Leader;
import com.dainws.games.crm.domain.models.card.Spell;
import com.dainws.games.crm.domain.models.card.Warrior;
import com.dainws.games.crm.domain.models.card.WarriorRarity;

public interface Deck {
	Warrior drawWarrior(WarriorRarity rarity);

	Equipment drawEquipment();

	Leader drawLeader();

	Spell drawSpell();
}
