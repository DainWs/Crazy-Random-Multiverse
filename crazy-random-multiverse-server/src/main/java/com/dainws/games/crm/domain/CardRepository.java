package com.dainws.games.crm.domain;

import java.util.List;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.WarriorRarity;
import com.dainws.games.cbg.domain.exception.CardNotFoundException;

public interface CardRepository {
	boolean has(CardCode cardCode);

	Card find(CardCode cardCode) throws CardNotFoundException;

	List<Card> findAll();

	List<Card> findByCardType(CardType cardType);

	List<Card> findWarriorsByRarity(WarriorRarity rarity);
}
