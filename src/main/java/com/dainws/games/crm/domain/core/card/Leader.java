package com.dainws.games.crm.domain.core.card;

import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.DamageType;
import com.dainws.games.crm.domain.core.card.statistics.Health;

public class Leader extends Combatant {

	public Leader(long code) {
		super(code);
		this.damage = Damage.newInstance(10, DamageType.PHYSICAL);
		this.health = Health.newInstance(100);
		this.armor = Armor.NONE;
	}

	@Override
	public CardType getType() {
		return CardType.LEADER;
	}
}
