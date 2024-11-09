package com.dainws.games.crm.domain.mode.classic;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.GameStrategy;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class ClassicGameStrategy implements GameStrategy {

	public static final GameMode CLASSIC_MODE = new GameMode("CLASSIC_MODE");

	private Party party;
	private Deck selectedDeck;
	private EventPublisher eventPublisher;
	private ExceptionPublisher exceptionPublisher;

	public ClassicGameStrategy(Party party, Deck deck) {
		this.party = party;
		this.selectedDeck = deck;
	}

	@Override
	public GameMode getGameMode() {
		return CLASSIC_MODE;
	}

	@Override
	public Dealer createDealer() {
		Dealer dealer = new Dealer(this.selectedDeck);
		dealer.setDealStrategyFactory(new ClassicDealStrategyFactory());
		return dealer;
	}

	@Override
	public Turn createTurn(PlayerStorage players) {
		return new Turn(players);
	}

	@Override
	public Board createBoard(PlayerStorage players) {
		return new Board(ZoneWithLeader::new, players);
	}

	@Override
	public PlayerStorage createPlayerStorage() {
		List<Player> players = new ArrayList<>();

		for (User user : this.party.getUsers()) {
			players.add(new UserPlayer(user));
		}

		return new PlayerStorage(players);
	}

	@Override
	public EventPublisher createEventPublisher(Game game) {
		return this.eventPublisher;
	}

	@Override
	public ExceptionPublisher createExceptionPublisher(Game game) {
		return this.exceptionPublisher;
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void setExceptionPublisher(ExceptionPublisher exceptionPublisher) {
		this.exceptionPublisher = exceptionPublisher;
	}

}
