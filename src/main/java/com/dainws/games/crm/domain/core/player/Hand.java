package com.dainws.games.crm.domain.core.player;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

public class Hand {

	private List<Card> cards;

	public Hand() {
		this.cards = new ArrayList<>();
	}

	public void addCard(Card card) {
		this.cards.add(card);
	}

	public void addCards(List<Card> cards) {
		this.cards.addAll(cards);
	}

	public boolean contains(Card card) {
		return this.cards.contains(card);
	}

	public boolean contains(CardCode code) {
		return this.cards.stream().anyMatch(card -> card.getCode().equals(code));
	}

	public boolean contains(CardType type) {
		return this.cards.stream().anyMatch(card -> card.isType(type));
	}

	public void remove(Card card) {
		this.cards.remove(card);
	}

	public void remove(CardCode code) throws NotFoundException {
		Card card = this.getCard(code);
		this.cards.remove(card);
	}

	public void removeAllOf(CardType type) {
		this.cards.removeIf(card -> card.isType(type));
	}

	public Card grab(CardCode code) throws NotFoundException {
		Card card = this.getCard(code);
		this.cards.remove(card);
		return card;
	}

	public Card getCard(CardCode code) throws NotFoundException {
		Optional<Card> optionalCard = Optional.empty();

		for (Card card : this.cards) {
			if (card.getCode().equals(code)) {
				optionalCard = Optional.of(card);
			}
		}

		if (optionalCard.isEmpty()) {
			throw NotFoundException.cardNotFound();
		}

		return optionalCard.get();
	}

	public List<Card> getCardsOf(CardType type) {
		List<Card> searchedCards = new ArrayList<>();

		for (Card card : this.cards) {
			if (card.isType(type)) {
				searchedCards.add(card);
			}
		}

		return searchedCards;
	}

	public boolean isEmpty() {
		return this.cards.isEmpty();
	}
	
	public List<Card> getCards() {
		return cards;
	}
}
