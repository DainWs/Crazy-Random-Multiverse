package com.dainws.games.crm.domain.repositories;

import java.util.List;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.WarriorRarity;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

public interface CardRepository {
	boolean has(CardCode cardCode);

	Card find(CardCode cardCode) throws NotFoundException;

	List<Card> findAll();

	List<Card> findByCardType(CardType cardType);

	List<Card> findWarriorsByRarity(WarriorRarity rarity);
}
