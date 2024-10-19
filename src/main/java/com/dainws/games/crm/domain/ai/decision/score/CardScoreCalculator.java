package com.dainws.games.crm.domain.ai.decision.score;

import java.util.EnumMap;
import java.util.Map;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

public class CardScoreCalculator implements ScoreCalculator<Card> {

	private Map<WarriorRarity, Integer> rarityScoreMap;
	
	public CardScoreCalculator() {
		this.rarityScoreMap = new EnumMap<>(WarriorRarity.class);
		this.rarityScoreMap.put(WarriorRarity.COMMON, 1);
		this.rarityScoreMap.put(WarriorRarity.UNCOMMON, 2);
		this.rarityScoreMap.put(WarriorRarity.RARE, 3);
		this.rarityScoreMap.put(WarriorRarity.EPIC, 4);
		this.rarityScoreMap.put(WarriorRarity.LEGENDARY, 4);
		this.rarityScoreMap.put(WarriorRarity.MITHIC, 4);
	}

	@Override
	public Score calculate(Game game, Card card) {
		Score score = new Score();

		if (card == null) {
			score.decrease(Integer.MAX_VALUE);
			return score;
		}

		if (card.isType(CardType.SPELL)) {
			score.increase(1);
		}

		if (card.isType(CardType.EQUIPMENT)) {
			score.increase(3);
			score.increase(this.calculateEquipmentScore((Equipment) card));
		}

		if (card.isType(CardType.LEADER)) {
			score.increase(10);
			score.increase(this.calculateCombatantScore((Leader) card));
		}

		if (card.isType(CardType.WARRIOR)) {
			score.increase(5);
			score.increase(this.calculateWarriorScore((Warrior) card));
		}

		return score;
	}
	
	public Score calculateWarriorScore(Warrior warrior) {
		Score score = new Score();

		if (warrior == null || !warrior.isAlive()) {
			score.decrease(Integer.MAX_VALUE);
			return score;
		}

		score.increase(this.calculateCombatantScore(warrior));
		score.increase(this.rarityScoreMap.get(warrior.getRarity()));
		return score;
	}

	public Score calculateCombatantScore(Combatant combatant) {
		Score score = new Score();

		if (combatant == null || !combatant.isAlive()) {
			score.decrease(Integer.MAX_VALUE);
			return score;
		}

		Equipment equipment = combatant.getEquipment();
		if (equipment != null) {
			score.increase(this.calculateEquipmentScore(equipment));
		}

		Double damageValue = combatant.getDamage().getValue();
		Double armorValue = combatant.getArmor().getValue();
		Double healthValue = combatant.getHealth().getValue();

		score.increase(damageValue.intValue());
		score.increase(armorValue.intValue());
		score.increase(healthValue.intValue());
		return score;
	}

	public Score calculateEquipmentScore(Equipment equipment) {
		Score score = new Score();

		if (equipment == null) {
			score.decrease(Integer.MAX_VALUE);
			return score;
		}

		Double damageValue = equipment.getDamageValue();
		Double armorValue = equipment.getArmorValue();
		Double healthValue = equipment.getHealthValue();

		score.increase(damageValue.intValue());
		score.increase(armorValue.intValue());
		score.increase(healthValue.intValue());
		return score;
	}
}
