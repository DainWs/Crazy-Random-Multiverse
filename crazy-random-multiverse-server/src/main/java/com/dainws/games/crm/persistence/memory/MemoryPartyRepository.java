package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.persistence.PartyRepository;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;

public class MemoryPartyRepository implements PartyRepository {

	private Map<PartyCode, Party> parties;
	private Logger logger;

	public MemoryPartyRepository() {
		this.parties = new HashMap<>();
		this.logger = LoggerFactory.getLogger(MemoryPartyRepository.class.getCanonicalName());
	}

	@Override
	public void save(Party party) {
		this.logger.info("Guardando Party con codigo {}", party.getCode());
		this.parties.put(party.getCode(), party);
	}

	@Override
	public void delete(PartyCode partyCode) {
		this.logger.info("Borrando Party con codigo {}", partyCode);
		this.parties.remove(partyCode);
	}
	
	@Override
	public boolean has(PartyCode partyCode) {
		return this.parties.containsKey(partyCode);
	}

	@Override
	public Party find(PartyCode partyCode) throws PartyNotFoundException {
		if (this.has(partyCode)) {
			return this.parties.get(partyCode);
		}

		throw new PartyNotFoundException();
	}

	@Override
	public List<Party> findAll() {
		return List.copyOf(this.parties.values());
	}

}