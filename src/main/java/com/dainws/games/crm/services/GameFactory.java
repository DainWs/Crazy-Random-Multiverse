package com.dainws.games.crm.services;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.Party;
import com.dainws.games.crm.domain.models.User;
import com.dainws.games.crm.domain.models.player.Player;
import com.dainws.games.crm.domain.models.player.PlayerCode;
import com.dainws.games.crm.persistence.repositories.PartyRepository;

public class GameFactory {
	private PartyRepository partyRepository;

	public GameFactory(PartyRepository partyRepository) {
		this.partyRepository = partyRepository;
	}

	public Game createGameFromPartyOwner(User partyOwner) {
		Party party = this.getLockedPartyFromPartyOwner(partyOwner);
		List<Player> players = this.createPlayersFrom(party.getUsers());
		return new Game(players);
	}

	private Party getLockedPartyFromPartyOwner(User partyOwner) {
		Party party = this.partyRepository.findPartyWhereUserIsOwner(partyOwner);
		party.lock();

		this.partyRepository.save(party);
		return party;
	}

	private List<Player> createPlayersFrom(List<User> users) {
		List<Player> players = new ArrayList<>();
		for (User user : users) {
			PlayerCode playerCode = PlayerCode.from(user.getCode().getValue());
			players.add(new Player(playerCode, user.getName()));
		}

		return players;
	}
}
