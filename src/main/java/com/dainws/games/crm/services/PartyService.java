package com.dainws.games.crm.services;

import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.core.exception.OperationNotAllowedException;
import com.dainws.games.crm.domain.repositories.PartyRepository;

public class PartyService {

	private UserClient userClient;
	private PartyRepository repository;
	
	public PartyService(PartyRepository repository) {
		this.repository = repository;
	}
	
	public void releaseGameParties(GameCode code) {
		List<Party> parties =  this.repository.findPartiesInGame(code);
		
		for (Party party : parties) {
			party.setNoneCurrentGame();
			party.unlock();
			this.repository.save(party);
		}
	}

	public void createParty(User partyOwner) throws OperationNotAllowedException {
		if (this.repository.hasPartyWhereUserIsPresent(partyOwner)) {
			throw new OperationNotAllowedException("user_already_in_party");
		}

		Party party = new Party(partyOwner);
		this.repository.save(party);

		this.sendPartyInfoTo(partyOwner, party);
	}

	public void joinParty(PartyCode partyCode, User user) throws OperationNotAllowedException {
		if (this.repository.hasPartyWhereUserIsPresent(user)) {
			throw new OperationNotAllowedException("user_already_in_party");
		}

		Party party = this.repository.find(partyCode);
		party.add(user);

		this.sendPartyInfoTo(party.getUsers(), party);
	}

	public void leaveParty(User user) throws NotFoundException, OperationNotAllowedException {
		Party party = this.repository.findPartyWhereUserIsPresent(user);
		party.remove(user);

		this.sendPartyInfoTo(party.getUsers(), party);

		if (party.isEmpty()) {
			this.repository.delete(party.getCode());
		}
	}

	public void tryLeaveParty(User user) {
		try {
			if (this.repository.hasPartyWhereUserIsPresent(user)) {
				this.leaveParty(user);
			}
		} catch (NotFoundException | OperationNotAllowedException e) {}
	}

	public void updatePartyListOf(User user) {
		List<Party> parties = this.repository.findAll();
		this.userClient.sendPartyList(user, parties);
	}

	private void sendPartyInfoTo(List<User> users, Party party) {
		for (User user : users) {
			this.sendPartyInfoTo(user, party);
		}
	}
	
	private void sendPartyInfoTo(User user, Party party) {
		this.userClient.sendPartyInfo(user, party);
	}

	public void setUserClient(UserClient userClient) {
		this.userClient = userClient;
	}
}
