package com.dainws.games.crm.console.controllers;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Spell;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.crm.console.controllers.dto.CardDto;
import com.dainws.games.crm.console.controllers.dto.CombatantDto;
import com.dainws.games.crm.console.controllers.dto.EquipmentDto;
import com.dainws.games.crm.console.controllers.dto.HandDto;
import com.dainws.games.crm.console.controllers.dto.WarriorDto;

public class HandMapper {

	public HandDto map(Hand hand) {
		CardMapper cardMapper = new CardMapper();
		HandDto handDto = new HandDto();
		handDto.setLeaders(this.mapLeadersFromHand(cardMapper, hand));
		handDto.setWarriors(this.mapWarriorsFromHand(cardMapper, hand));
		handDto.setEquipments(this.mapEquipmentsFromHand(cardMapper, hand));
		handDto.setSpells(this.mapSpellsFromHand(cardMapper, hand));

		return handDto;
	}
	
	private List<CombatantDto> mapLeadersFromHand(CardMapper cardMapper, Hand hand) {
		List<CombatantDto> dtos = new ArrayList<>();
		for (Card card : hand.getCardsOf(CardType.LEADER)) {
			dtos.add(cardMapper.mapCombatant((Leader) card));
		}
		
		return dtos;
	}
	
	private List<WarriorDto> mapWarriorsFromHand(CardMapper cardMapper, Hand hand) {
		List<WarriorDto> dtos = new ArrayList<>();
		for (Card card : hand.getCardsOf(CardType.WARRIOR)) {
			dtos.add(cardMapper.mapWarrior((Warrior) card));
		}
		
		return dtos;
	}

	private List<EquipmentDto> mapEquipmentsFromHand(CardMapper cardMapper, Hand hand) {
		List<EquipmentDto> dtos = new ArrayList<>();
		for (Card card : hand.getCardsOf(CardType.EQUIPMENT)) {
			dtos.add(cardMapper.mapEquipment((Equipment) card));
		}
		
		return dtos;
	}

	private List<CardDto> mapSpellsFromHand(CardMapper cardMapper, Hand hand) {
		List<CardDto> dtos = new ArrayList<>();
		for (Card card : hand.getCardsOf(CardType.SPELL)) {
			dtos.add(cardMapper.mapCard((Spell) card));
		}
		
		return dtos;
	}
}
