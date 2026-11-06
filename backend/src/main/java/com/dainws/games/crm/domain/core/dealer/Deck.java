package com.dainws.games.crm.domain.core.dealer;

import java.util.Optional;

import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

public interface Deck {
	Optional<Warrior> drawWarrior(WarriorRarity rarity);

	Optional<Equipment> drawEquipment();

	Optional<Leader> drawLeader();

	Optional<Spell> drawSpell();
}
