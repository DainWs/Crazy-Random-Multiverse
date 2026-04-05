package com.dainws.games.crm.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.repositories.PartyRepository;
import com.dainws.games.crm.services.exception.PartyException;

@Service
public class PartyOwnerService {
	private UserClient userClient;
	private GameService gameService;
	private PartyRepository repository;

	public PartyOwnerService(PartyRepository repository, GameService gameService) {
		this.userClient = UserClient.NONE;
		this.repository = repository;
		this.gameService = gameService;
	}

	public void updateParty(User supposedOwner, Party updatedParty) throws PartyException {
		Party party = this.getPartyOwnedBy(updatedParty.getCode(), supposedOwner);
		party.changeMode(updatedParty.getGameMode());
		party.setMaxUsers(updatedParty.getMaxUsers());
		this.repository.save(party);
		this.userClient.sendPartyInfo(party);
	}

	public void kickUserFromParty(User supposedOwner, PartyCode partyCode, UserCode userToKick) throws PartyException {
		try {
			Party party = this.getPartyOwnedBy(partyCode, supposedOwner);
			party.remove(userToKick);
			
			this.repository.save(party);
			this.userClient.sendPartyInfo(party);
		} catch (NotAllowedException e) {
			throw new PartyException(e.getCode(), e);
		}
	}

	public void startPartyGame(User supposedOwner, PartyCode partyCode) throws PartyException {
		Party party = this.getPartyOwnedBy(partyCode, supposedOwner);
		this.gameService.loadPartyGame(party);
		this.repository.save(party);
	}

	private Party getPartyOwnedBy(PartyCode partyCode, User supposedOwner) throws PartyException {
		if (!this.repository.has(partyCode)) {
			throw PartyException.partyNotFound();
		}

		Party party = this.repository.find(partyCode);
		if (!party.isOwner(supposedOwner)) {
			throw PartyException.userIsNotPartyOwner();
		}

		return party;
	}

	@Autowired
	public void setUserClient(UserClient userClient) {
		this.userClient = userClient;
	}
}
