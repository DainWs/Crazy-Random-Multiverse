package com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards;

import java.util.List;

import org.springframework.stereotype.Component;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.EquipmentCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.LeaderCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.SpellCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.WarriorCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.ports.CardRepository;
import com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.equipment.EquipmentCardRepository;
import com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.leaders.LeaderCardRepository;
import com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.spells.SpellCardRepository;
import com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.warriors.WarriorCardRepository;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;

@Component
public class CardRepositoryFacade implements CardRepository {
	private EquipmentCardRepository equipmentCardRepository;
	private LeaderCardRepository leaderCardRepository;
	private SpellCardRepository spellCardRepository;
	private WarriorCardRepository warriorCardRepository;

	public CardRepositoryFacade(EquipmentCardRepository equipmentCardRepository,
			LeaderCardRepository leaderCardRepository, SpellCardRepository spellCardRepository,
			WarriorCardRepository warriorCardRepository) {
		this.equipmentCardRepository = equipmentCardRepository;
		this.leaderCardRepository = leaderCardRepository;
		this.spellCardRepository = spellCardRepository;
		this.warriorCardRepository = warriorCardRepository;
	}

	@Override
	public List<SpellCard> provideSpells() {
		return this.spellCardRepository.provideAll();
	}

	@Override
	public List<LeaderCard> provideLeaders() {
		return this.leaderCardRepository.provideAll();
	}

	@Override
	public List<EquipmentCard> provideEquipments() {
		return this.equipmentCardRepository.provideAll();
	}

	@Override
	public List<WarriorCard> provideWarriors() {
		return this.warriorCardRepository.provideAll();
	}

	@Override
	public List<WarriorCard> provideWarriors(CardRarity cardRarity) {
		return this.warriorCardRepository.provideAll(cardRarity);
	}

}
