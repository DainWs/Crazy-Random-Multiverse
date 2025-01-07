package com.dainws.games.crm.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.repositories.PartyRepository;

@TestComponent
public class PartyPopulator {

	@Autowired
	private PartyRepository partyRepository;
	
	@Autowired
	private UserPopulator userPopulator;
	
	public Party populate() {
		Party party = this.createBasic(GameMode.NONE);
		return this.populate(party);
	}
	
	public Party populate(GameMode gameMode) {
		Party party = this.createBasic(gameMode);
		return this.populate(party);
	}
	
	public Party populate(Party party) {
		this.partyRepository.save(party);
		return party;
	}
	
	private Party createBasic(GameMode gameMode) {
		try {
			User owner = this.userPopulator.populate();
			Party party = new Party(owner, gameMode);
			party.add(this.userPopulator.populate());
			return party;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
