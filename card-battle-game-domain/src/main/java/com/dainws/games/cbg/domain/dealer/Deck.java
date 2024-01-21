package com.dainws.games.cbg.domain.dealer;

import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Spell;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.WarriorRarity;

public interface Deck {
	Warrior drawWarrior(WarriorRarity rarity);

	Equipment drawEquipment();

	Leader drawLeader();

	Spell drawSpell();
}
