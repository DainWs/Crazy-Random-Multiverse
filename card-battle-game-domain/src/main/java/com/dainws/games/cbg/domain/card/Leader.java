package com.dainws.games.cbg.domain.card;

import com.dainws.games.cbg.domain.card.statistics.Armor;
import com.dainws.games.cbg.domain.card.statistics.Damage;
import com.dainws.games.cbg.domain.card.statistics.DamageType;
import com.dainws.games.cbg.domain.card.statistics.Health;

public class Leader extends Combatant {

	public Leader(long code, String name, String description) {
		super(code, name, description);
		this.damage = Damage.newInstance(100, DamageType.PHYSICAL);
		this.health = Health.newInstance(100);
		this.armor = Armor.NONE;
	}

	@Override
	public CardType getType() {
		return CardType.LEADER;
	}
}
