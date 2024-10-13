package com.dainws.games.crm.domain.mode.classic;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.GameModeFactory;

public class ClassicGameModeFactory implements GameModeFactory {

	private Deck deck;
	
	public ClassicGameModeFactory(Deck deck) {
		this.deck = deck;
	}
	
	@Override
	public GameMode getMode() {
		return new GameMode("CLASSIC");
	}

	@Override
	public Game createGame(Party party) {
		List<Player> players = new ArrayList<>();
		for (User user : party.getUsers()) {
			players.add(new UserPlayer(user));
		}

		Board board = new Board(this::createZoneWithLeader, players);
		return new ClassicGame(board, this.createDealer(), players);
	}

	private Dealer createDealer() {
		Dealer dealer = new Dealer(this.deck);
		dealer.setDealStrategyFactory(new ClassicDealStrategyFactory());
		return dealer;
	}

	private Zone createZoneWithLeader() {
		return new ZoneWithLeader();
	}

}
