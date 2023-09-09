package com.dainws.games.cbg.domain.player;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.player.exception.NoSuchCardException;

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

	public void remove(Card card) {
		this.cards.remove(card);
	}

	public void remove(CardCode code) throws NoSuchCardException {
		Card card = this.getCard(code);
		this.cards.remove(card);
	}

	public Card grab(CardCode code) throws NoSuchCardException {
		Card card = this.getCard(code);
		this.cards.remove(card);
		return card;
	}

	public Card getCard(CardCode code) throws NoSuchCardException {
		Optional<Card> optionalCard = Optional.empty();

		for (Card card : this.cards) {
			if (card.getCode().equals(code)) {
				optionalCard = Optional.of(card);
			}
		}

		if (optionalCard.isEmpty()) {
			throw new NoSuchCardException("There is none card with that CardCode: " + code);
		}

		return optionalCard.get();
	}

	public List<Card> getCards() {
		return cards;
	}
}
