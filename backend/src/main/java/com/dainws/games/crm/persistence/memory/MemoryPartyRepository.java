package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.repositories.PartyRepository;

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
	public boolean hasPartyWhereUserIsMember(User user) {
		return this.parties.values().stream()
				.anyMatch(party -> party.has(user));
	}

	@Override
	public Party find(PartyCode partyCode) throws NotFoundException {
		if (this.has(partyCode)) {
			return this.parties.get(partyCode);
		}

		throw new NotFoundException("party");
	}
	
	@Override
	public Party findPartyWhereUserIsOwner(UserCode userCode) throws NotFoundException {
		return this.parties.values().stream()
			.filter(party -> party.isOwner(userCode))
			.findFirst()
			.orElseThrow(() -> new NotFoundException("party"));
	}
	
	@Override
	public Party findPartyWhereUserIsMember(UserCode userCode) throws NotFoundException {
		return this.parties.values().stream()
			.filter(party -> party.has(userCode))
			.findFirst()
			.orElseThrow(() -> new NotFoundException("party"));
	}

	@Override
	public List<Party> findAll() {
		return List.copyOf(this.parties.values());
	}
	
	@Override
	public List<Party> findPartiesInGame(GameCode code) {
		return this.parties.values().stream()
			.filter(party -> party.isCurrentGame(code))
			.toList();
	}

}