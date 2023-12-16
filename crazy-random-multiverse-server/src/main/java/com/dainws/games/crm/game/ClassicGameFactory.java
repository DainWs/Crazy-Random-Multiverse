package com.dainws.games.crm.game;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.persistence.entity.User;

public class ClassicGameFactory {
	public Game create(Party party, Set<Card> gameCards) {
		party.lock();

		return Game.builder()
				.setCode(party.getCodeValue())
				.prepareDeckWith(gameCards)
				.setPlayers(this.createPlayersFrom(party.getUsers()))
				.build();
	}

	private List<Player> createPlayersFrom(List<User> users) {
		List<Player> players = new ArrayList<>();
		for (User user : users) {
			Player player = Player.builder()
					.withPlayerCode(user.getCode().toString())
					.withName(user.getName())
					.build();

			players.add(player);
		}

		return players;
	}
}
