package com.dainws.games.crm.persistence;

import java.util.Set;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.WarriorRarity;
import com.dainws.games.cbg.domain.exception.CardNotFoundException;

public interface CardRepository {
	boolean has(CardCode cardCode);

	Card find(CardCode cardCode) throws CardNotFoundException;

	Set<Card> findAll();

	Set<Card> findByCardType(CardType cardType);

	Set<Card> findWarriorsByRarity(WarriorRarity rarity);
}
