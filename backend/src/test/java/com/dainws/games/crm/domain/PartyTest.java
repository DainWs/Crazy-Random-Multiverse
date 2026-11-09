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

	// SPEC-3
	@Test
	void testGivenLockedParty_whenRemoveSpectator_thenMemberIsRemoved() throws NotAllowedException {
		this.party.add(this.newcomer);
		this.party.setCurrentGame(new GameCode());

		this.party.removeSpectator(this.newcomer.getCode());

		assertThat(this.party.has(this.newcomer)).isFalse();
	}

	// SPEC-3, PARTY-7
	@Test
	void testGivenLockedParty_whenOwnerRemovedAsSpectator_thenTheOtherMemberIsOwner() throws NotAllowedException {
		this.party.add(this.newcomer);
		this.party.setCurrentGame(new GameCode());

		this.party.removeSpectator(this.owner.getCode());

		assertThat(this.party.isOwner(this.newcomer)).isTrue();
	}

	// ABSENT-3
	@Test
	void testGivenLockedParty_whenRemoveWhenUnlocked_thenMemberStaysUntilUnlocked() throws NotAllowedException {
		this.party.add(this.newcomer);
		this.party.setCurrentGame(new GameCode());

		this.party.removeWhenUnlocked(this.newcomer.getCode());

		assertThat(this.party.has(this.newcomer)).isTrue();
	}

	// ABSENT-3
	@Test
	void testGivenMemberPendingRemoval_whenPartyUnlocks_thenMemberIsRemoved() throws NotAllowedException {
		this.party.add(this.newcomer);
		this.party.setCurrentGame(new GameCode());
		this.party.removeWhenUnlocked(this.newcomer.getCode());

		this.party.setCurrentGame(GameCode.NONE);

		assertThat(this.party.has(this.newcomer)).isFalse();
	}

	// PARTY-7
	@Test
	void testGivenOwnerPendingRemoval_whenPartyUnlocks_thenOwnershipPasses() throws NotAllowedException {
		this.party.add(this.newcomer);
		this.party.setCurrentGame(new GameCode());
		this.party.removeWhenUnlocked(this.owner.getCode());

		this.party.setCurrentGame(GameCode.NONE);

		assertThat(this.party.getOwner()).isSameAs(this.newcomer);
	}

	@Test
	void testGivenUnlockedParty_whenRemoveWhenUnlocked_thenMemberIsRemovedAtOnce() throws NotAllowedException {
		this.party.add(this.newcomer);

		this.party.removeWhenUnlocked(this.newcomer.getCode());

		assertThat(this.party.has(this.newcomer)).isFalse();
	}
}
