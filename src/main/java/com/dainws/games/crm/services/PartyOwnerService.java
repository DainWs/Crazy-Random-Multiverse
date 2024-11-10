package com.dainws.games.crm.services;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.repositories.PartyRepository;

public class PartyOwnerService {
	private GameService gameService;
	private PartyRepository repository;

	public PartyOwnerService(PartyRepository repository, GameService gameService) {
		this.repository = repository;
		this.gameService = gameService;
	}

	public void startPartyGame(User supposedOwner, PartyCode partyCode) {
		Party party = this.repository.find(partyCode);
		if (party.isOwner(supposedOwner)) {
			party.lock();

			this.gameService.loadPartyGame(party);
			this.repository.save(party);
		}
	}
}
