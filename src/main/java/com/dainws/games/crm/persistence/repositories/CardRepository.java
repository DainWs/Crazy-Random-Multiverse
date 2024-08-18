package com.dainws.games.crm.persistence.repositories;

import java.util.List;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.WarriorRarity;
import com.dainws.games.crm.domain.exception.CardNotFoundException;

public interface CardRepository {
	boolean has(CardCode cardCode);

	Card find(CardCode cardCode) throws CardNotFoundException;

	List<Card> findAll();

	List<Card> findByCardType(CardType cardType);

	List<Card> findWarriorsByRarity(WarriorRarity rarity);
}
