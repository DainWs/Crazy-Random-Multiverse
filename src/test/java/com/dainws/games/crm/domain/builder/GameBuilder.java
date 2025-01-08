package com.dainws.games.crm.domain.builder;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.DummyGameStrategy;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.DummyZone;
import com.dainws.games.crm.domain.core.board.ZoneFactory;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class GameBuilder {
	private Dealer dealer;
	private List<Player> players;
	private ZoneFactory zoneFactory;
	private EventPublisher eventPublisher;
	private ExceptionPublisher exceptionPublisher;
	
	public GameBuilder() {
		this.zoneFactory = DummyZone::new;
		this.players = new ArrayList<>();

		this.eventPublisher = EventPublisher.NONE;
		this.exceptionPublisher = ExceptionPublisher.NONE;
	}
	
	public GameBuilder withZoneFactory(ZoneFactory zoneFactory) {
		this.zoneFactory = zoneFactory;
		return this;
	}
	
	public GameBuilder withDealer(Dealer dealer) {
		this.dealer = dealer;
		return this;
	}
	
	public GameBuilder withPlayers(Player ...players) {
		return this.withPlayers(List.of(players));
	}
	
	public GameBuilder addPlayers(Player ...players) {
		return this.addPlayers(List.of(players));
	}
	
	public GameBuilder withPlayers(List<Player> players) {
		this.players.clear();
		return this.addPlayers(players);
	}
	
	public GameBuilder addPlayers(List<Player> players) {
		this.players.addAll(players);
		return this;
	}

	public GameBuilder withNRandomPlayers(int numberOfPlayers) {
		this.players.clear();
		for (int i = 0; i < numberOfPlayers; i++) {
			int numberOfCards = (int) (Math.random() * 10) + 1;
			Player randomPlayer = new PlayerBuilder()
					.withNRandomCardsInHand(numberOfCards)
					.build();
			this.players.add(randomPlayer);
		}
		return this;
	}
	
	public GameBuilder addNRandomPlayers(int numberOfPlayers) {
		for (int i = 0; i < numberOfPlayers; i++) {
			int numberOfCards = (int) (Math.random() * 10) + 1;
			Player randomPlayer = new PlayerBuilder()
					.withNRandomCardsInHand(numberOfCards)
					.build();
			this.players.add(randomPlayer);
		}
		return this;
	}
	
	public GameBuilder removeAllPlayers() {
		this.players.clear();
		return this;
	}
	
	public GameBuilder withEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
		return this;
	}
	
	public GameBuilder withExceptionPublisher(ExceptionPublisher exceptionPublisher) {
		this.exceptionPublisher = exceptionPublisher;
		return this;
	}
	
	public Game build() {
		DummyGameStrategy strategy = new DummyGameStrategy();
		strategy.setDealer(this.dealer);
		strategy.setZoneFactory(this.zoneFactory);
		strategy.setPlayers(new PlayerStorage(this.players));
		strategy.setEventPublisher(this.eventPublisher);
		strategy.setExceptionPublisher(this.exceptionPublisher);
		return new Game(strategy);
	}
}
