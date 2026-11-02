package com.dainws.games.crm.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PartyExceptionCode;
import com.dainws.games.crm.domain.mode.GameModes;

class PartyTest {

	private User owner;
	private User newcomer;
	private Party party;

	@BeforeEach
	void beforeEach() {
		this.owner = new User("user-1", "Owner", UserPlatform.WEB);
		this.newcomer = new User("user-2", "Newcomer", UserPlatform.WEB);
		this.party = new Party(this.owner, GameModes.CLASSIC);
	}

	@Test
	void testGivenLockedParty_whenAdd_thenCodeIsPartyLocked() {
		this.party.setCurrentGame(new GameCode());

		NotAllowedException exception = catchThrowableOfType(() -> this.party.add(this.newcomer), NotAllowedException.class);

		assertThat(exception.getCode()).isEqualTo(PartyExceptionCode.LOCKED);
	}

	@Test
	void testGivenFullParty_whenAdd_thenCodeIsPartyIsFull() {
		this.party.setMaxUsers(1);

		NotAllowedException exception = catchThrowableOfType(() -> this.party.add(this.newcomer), NotAllowedException.class);

		assertThat(exception.getCode()).isEqualTo(PartyExceptionCode.IS_FULL);
	}

	@Test
	void testGivenLockedParty_whenRemove_thenCodeIsPartyLocked() {
		this.party.setCurrentGame(new GameCode());

		NotAllowedException exception = catchThrowableOfType(() -> this.party.remove(this.owner), NotAllowedException.class);

		assertThat(exception.getCode()).isEqualTo(PartyExceptionCode.LOCKED);
	}

	@Test
	void testGivenMember_whenGetUser_thenReturnsThatUser() throws NotAllowedException {
		this.party.add(this.newcomer);

		assertThat(this.party.getUser(this.newcomer.getCode())).isSameAs(this.newcomer);
	}
}
