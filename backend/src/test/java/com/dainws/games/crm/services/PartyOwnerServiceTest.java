package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.response.GameModeDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.services.exception.PartyException;
import com.dainws.games.crm.usecase.dto.UpdatePartyRequest;

class PartyOwnerServiceTest {

	private static final int NEW_MAX_PLAYERS = 2;

	private MemoryPartyRepository repository;
	private PartyOwnerService service;
	private User owner;
	private Party party;

	@BeforeEach
	void setUp() {
		this.repository = new MemoryPartyRepository();
		this.service = new PartyOwnerService(this.repository, null);
		this.owner = new User("user-1", "Name", UserPlatform.WEB);
		this.party = new Party(this.owner, GameModes.CLASSIC);
		this.repository.save(this.party);
	}

	@Test
	void testGivenOwner_whenUpdateParty_thenMaxPlayersIsChanged() {
		this.service.updateParty(this.owner, this.updateRequest());

		assertThat(this.repository.find(this.party.getCode()).getMaxUsers()).isEqualTo(NEW_MAX_PLAYERS);
	}

	@Test
	void testGivenUserWhoIsNotOwner_whenUpdateParty_thenFails() {
		User other = new User("user-2", "Other", UserPlatform.WEB);

		assertThrows(PartyException.class, () -> this.service.updateParty(other, this.updateRequest()));
	}

	private UpdatePartyRequest updateRequest() {
		UpdatePartyRequest request = new UpdatePartyRequest();
		request.setCode(this.party.getCode().text());
		request.setGameMode(GameModeDto.CLASSIC);
		request.setMaxPlayers(NEW_MAX_PLAYERS);
		return request;
	}
}
