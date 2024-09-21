package com.dainws.games.crm.domain.builder;

import java.util.List;
import java.util.Objects;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.DummyPlayer;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class PlayerBuilder {

	private PlayerCode playerCode;
	private String name;
	private Hand hand;
	private boolean isSpectator;
	
	public PlayerBuilder() {
		String code = String.valueOf((int) (Math.random() * 10000));
		this.playerCode = PlayerCode.from(code);
		this.name = "test-player__" + code;
		this.hand = new Hand();
		this.isSpectator = false;
	}
	
	public PlayerBuilder withCode(String code) {
		this.playerCode = PlayerCode.from(code);
		return this;
	}
	
	public PlayerBuilder withCode(PlayerCode code) {
		this.playerCode = code;
		return this;
	}
	
	public PlayerBuilder withName(String name) {
		this.name = name;
		return this;
	}
	
	public PlayerBuilder withHand(Hand hand) {
		this.hand = hand;
		return this;
	}
	
	public PlayerBuilder withNoneCardsInHand() {
		for (CardType type : CardType.values()) {
			this.hand.removeAllOf(type);			
		}
		return this;
	}
	
	public PlayerBuilder withCardsInHand(List<Card> cards) {
		this.hand.addCards(cards);
		return this;
	}
	
	public PlayerBuilder withCardsInHand(Card ...cards) {
		for (Card card : cards) {
			this.hand.addCard(card);			
		}
		return this;
	}
	
	public PlayerBuilder withNRandomCardsInHand(int numberOfCards) {
		for (int i = 0; i < numberOfCards; i++) {
			this.hand.addCard(new CardBuilder().buildRandomFullValidCard());			
		}
		return this;
	}
	
	public PlayerBuilder withSpectator(boolean isSpectator) {
		this.isSpectator = isSpectator;
		return this;
	}
	
	public Player build() {
		Objects.requireNonNull(this.playerCode);
		Objects.requireNonNull(this.name);

		DummyPlayer dummyPlayer = new DummyPlayer(this.playerCode, this.name);
		if (this.isSpectator) {
			dummyPlayer.changeToSpectator(); 
		}
		
		if (this.hand != null) {
			dummyPlayer.setHand(this.hand);
		}
		
		return dummyPlayer;
	}
	
}
