package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.repositories.PartyRepository;

@Service
public class PartyEventService {
	private PartyRepository repository;

	public PartyEventService(PartyRepository repository) {
		this.repository = repository;
	}

	public void releaseGameParties(GameCode code) {
		List<Party> parties = this.repository.findPartiesInGame(code);

		for (Party party : parties) {
			party.setCurrentGame(GameCode.NONE);
			this.repository.save(party);
		}
	}
}
