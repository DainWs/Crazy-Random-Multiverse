package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.exception.PartyNotFoundException;
import com.dainws.games.crm.domain.models.Party;
import com.dainws.games.crm.domain.models.PartyCode;
import com.dainws.games.crm.domain.models.User;
import com.dainws.games.crm.domain.ports.PartyRepository;

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
	public boolean hasPartyWhereUserIsPresent(User user) {
		return this.parties.values().stream()
				.anyMatch(party -> party.has(user));
	}

	@Override
	public Party find(PartyCode partyCode) throws PartyNotFoundException {
		if (this.has(partyCode)) {
			return this.parties.get(partyCode);
		}

		throw new PartyNotFoundException();
	}
	
	@Override
	public Party findPartyWhereUserIsOwner(User user) throws PartyNotFoundException {
		return this.parties.values().stream()
			.filter(party -> party.getOwner().equals(user))
			.findFirst()
			.orElseThrow(PartyNotFoundException::new);
	}
	
	@Override
	public Party findPartyWhereUserIsPresent(User user) throws PartyNotFoundException {
		return this.parties.values().stream()
			.filter(party -> party.has(user))
			.findFirst()
			.orElseThrow(PartyNotFoundException::new);
	}

	@Override
	public List<Party> findAll() {
		return List.copyOf(this.parties.values());
	}

}