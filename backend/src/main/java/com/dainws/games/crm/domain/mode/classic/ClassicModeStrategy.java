package com.dainws.games.crm.domain.mode.classic;

import java.util.ArrayList;
import java.util.List;
import java.util.random.RandomGenerator;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.GameModeStrategy;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.mode.GameModes;

public class ClassicModeStrategy implements GameModeStrategy {

	public static final GameMode CLASSIC_MODE = new GameMode("CLASSIC_MODE");
	public static final int STARTING_ROUND = 0;

	private Party party;
	private Deck selectedDeck;
	private RandomGenerator random;
	private EventPublisher eventPublisher;

	public ClassicModeStrategy(Party party, Deck deck) {
		this.party = party;
		this.selectedDeck = deck;
		this.random = RandomGenerator.getDefault();
	}

	@Override
	public GameMode getGameMode() {
		return GameModes.CLASSIC;
	}

	@Override
	public Dealer createDealer() {
		Dealer dealer = new Dealer(this.selectedDeck);
		dealer.setDealStrategyFactory(new ClassicDealStrategyFactory());
		return dealer;
	}

	@Override
	public Turn createTurn(PlayerStorage players) {
		int index = this.random.nextInt(players.size());
		Player playerWithTurn = players.get(index);
		return new Turn(players, playerWithTurn, STARTING_ROUND);
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

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void setRandom(RandomGenerator random) {
		this.random = random;
	}
}
