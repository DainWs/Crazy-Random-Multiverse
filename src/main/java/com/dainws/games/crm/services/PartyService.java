package com.dainws.games.crm.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.GameRuntimeException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.repositories.PartyRepository;
import com.dainws.games.crm.services.exception.PartyException;

@Service
public class PartyService {

	private UserClient userClient;
	private PartyRepository repository;

	public PartyService(PartyRepository repository) {
		this.repository = repository;
	}

	public void createParty(User partyOwner, Party party) throws PartyException {
		if (this.repository.hasPartyWhereUserIsMember(partyOwner)) {
			throw PartyException.userAlreadyInParty();
		}

		this.repository.save(party);
	}

	public Party joinParty(PartyCode partyCode, User user) throws PartyException {
		if (this.repository.hasPartyWhereUserIsMember(user)) {
			throw PartyException.userAlreadyInParty();
		}

		try {
			Party party = this.repository.find(partyCode);
			party.add(user);
			this.repository.save(party);
			return party;
		} catch (NotAllowedException e) {
			throw new PartyException(e.getCode(), e);
		}

	}

	public void leaveParty(User user) throws PartyException {
		Party party = this.repository.findPartyWhereUserIsMember(user.getCode());
		this.leaveParty(party.getCode(), user);
	}

	public void leaveParty(PartyCode partyCode, User user) throws PartyException {
		try {
			Party party = this.repository.find(partyCode);
			party.remove(user);

			if (party.isEmpty()) {
				this.repository.delete(party.getCode());
			} else {
				this.userClient.sendPartyInfo(party);
			}
		} catch (GameException e) {
			throw new PartyException(e.getCode(), e);
		} catch (GameRuntimeException e) {
			throw new PartyException(e.getCode(), e);
		}
	}

	public List<Party> getParties() {
		return this.repository.findAll();
	}

	@Autowired
	public void setUserClient(UserClient userClient) {
		this.userClient = userClient;
	}
}
