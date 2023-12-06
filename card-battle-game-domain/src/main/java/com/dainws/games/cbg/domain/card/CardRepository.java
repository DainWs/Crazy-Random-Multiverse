package com.dainws.games.cbg.domain.card;

import java.util.Set;

import com.dainws.games.cbg.domain.exception.CardNotFoundException;

public interface CardRepository {
	boolean has(CardCode cardCode);

	Card find(CardCode cardCode) throws CardNotFoundException;

	Set<Card> findAll();

	Set<Card> findByCardType(CardType cardType);

	Set<Card> findWarriorsByRarity(WarriorRarity rarity);
}
