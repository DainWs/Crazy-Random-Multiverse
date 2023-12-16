package com.dainws.games.crm.console.controllers;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.statistics.Armor;
import com.dainws.games.cbg.domain.card.statistics.Damage;
import com.dainws.games.cbg.domain.card.statistics.Health;
import com.dainws.games.crm.console.controllers.dto.CardDto;
import com.dainws.games.crm.console.controllers.dto.CombatantDto;
import com.dainws.games.crm.console.controllers.dto.EquipmentDto;
import com.dainws.games.crm.console.controllers.dto.WarriorDto;

public class CardMapper {
	public CardDto mapCard(Card card) {
		CardDto cardDto = new CardDto();
		cardDto.setCardType(card.getType().name());
		cardDto.setName(card.getName());
		cardDto.setDescription(card.getDescription());
		return cardDto;
	}
	
	public CombatantDto mapCombatant(Combatant combatant) {
		CombatantDto combatantDto = (CombatantDto) this.mapCard(combatant);
		
		Health health = combatant.getHealth();
		combatantDto.setHealth(String.valueOf(health.getValue()));
		combatantDto.setMaxHealth(String.valueOf(health.getMaxValue()));
		
		if (health.isInfinite()) {
			combatantDto.setHealth("∞");
			combatantDto.setMaxHealth("∞");
		}
		
		Damage damage = combatant.getDamage();
		combatantDto.setDamage(String.valueOf(damage.getValue()));
		combatantDto.setDamageType(damage.getType().name());
		
		if (damage.isInfinite()) {
			combatantDto.setDamage("∞");
			combatantDto.setDamageType("Infinite");
		}
		
		Armor armor = combatant.getArmor();
		combatantDto.setArmor(String.valueOf(armor.getValue()));
		combatantDto.setArmorType(armor.getType().name());

		return combatantDto;
	}
	
	public WarriorDto mapWarrior(Warrior warrior) {
		WarriorDto warriorDto = (WarriorDto) this.mapCombatant(warrior);
		warriorDto.setRarity(warrior.getRarity().name());

		return warriorDto;
	}
	
	public EquipmentDto mapEquipment(Equipment equipment) {
		EquipmentDto equipmentDto = (EquipmentDto) this.mapCard(equipment);
		equipmentDto.setDamage(String.valueOf(equipment.getDamageValue()));
		equipmentDto.setHealth(String.valueOf(equipment.getHealthValue()));
		equipmentDto.setArmor(String.valueOf(equipment.getArmorValue()));

		return equipmentDto;
	}
}
