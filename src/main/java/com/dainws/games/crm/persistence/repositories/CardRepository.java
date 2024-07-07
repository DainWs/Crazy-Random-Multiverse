package com.dainws.games.crm.persistence.repositories;

import java.util.List;

import com.dainws.games.crm.domain.exception.CardNotFoundException;
import com.dainws.games.crm.domain.models.card.Card;
import com.dainws.games.crm.domain.models.card.CardCode;
import com.dainws.games.crm.domain.models.card.CardType;
import com.dainws.games.crm.domain.models.card.WarriorRarity;

public interface CardRepository {
	boolean has(CardCode cardCode);

	Card find(CardCode cardCode) throws CardNotFoundException;

	List<Card> findAll();

	List<Card> findByCardType(CardType cardType);

	List<Card> findWarriorsByRarity(WarriorRarity rarity);
}
