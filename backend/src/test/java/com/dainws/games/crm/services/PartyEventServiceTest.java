package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.RecordingUserClient;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;

class PartyEventServiceTest {

	private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");
	private static final Duration RESULT_DURATION = Duration.ofSeconds(15);
	private static final int PLAYERS = 2;

	private MemoryPartyRepository partyRepository;
	private MemoryGameRepository gameRepository;
	private ManualTaskScheduler scheduler;
	private RecordingUserClient userClient;
	private PartyEventService service;
	private Party party;
	private Game game;

	@BeforeEach
	void beforeEach() {
		this.partyRepository = new MemoryPartyRepository();
		this.gameRepository = new MemoryGameRepository();
		this.scheduler = new ManualTaskScheduler();
		this.userClient = new RecordingUserClient();
		this.service = new PartyEventService(this.partyRepository, this.gameRepository, this.scheduler);
		this.service.setClock(Clock.fixed(NOW, ZoneOffset.UTC));
		this.service.setResultDuration(RESULT_DURATION);
		this.service.setUserClient(this.userClient);

		this.game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		this.gameRepository.save(this.game);
		this.party = new Party(new User("user-1", "Name", UserPlatform.WEB), GameModes.CLASSIC);
		this.party.setCurrentGame(this.game.getCode());
		this.partyRepository.save(this.party);
	}

	@Test
	void testGivenGameEnd_whenScheduleReleaseWhenGameEnds_thenReleaseWaitsTheResultDuration() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		assertThat(this.scheduler.getScheduledTime()).isEqualTo(NOW.plus(RESULT_DURATION));
	}

	@Test
	void testGivenEventThatIsNotGameEnd_whenScheduleReleaseWhenGameEnds_thenNothingIsScheduled() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.TURN_CHANGE, this.game));

		assertThat(this.scheduler.hasScheduledTask()).isFalse();
	}

	@Test
	void testGivenResultTimeEnded_whenReleaseRuns_thenThePartyIsUnlocked() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		this.scheduler.runScheduledTask();

		assertThat(this.partyRepository.find(this.party.getCode()).isLocked()).isFalse();
	}

	@Test
	void testGivenResultTimeEnded_whenReleaseRuns_thenTheGameIsRemoved() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		this.scheduler.runScheduledTask();

		assertThat(this.gameRepository.exists(this.game.getCode())).isFalse();
	}

	@Test
	void testGivenResultTimeEnded_whenReleaseRuns_thenMembersReceiveTheUnlockedParty() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		this.scheduler.runScheduledTask();

		assertThat(this.userClient.getSentParties()).allSatisfy(sent -> assertThat(sent.isLocked()).isFalse());
		assertThat(this.userClient.getRecipients()).containsExactlyElementsOf(this.party.getUsers());
	}

	// CON-22
	@Test
	void testGivenCancelledLoading_whenGameFinishes_thenThePartyIsUnlockedAtOnce() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_CANCELLED, this.game));

		assertThat(this.partyRepository.find(this.party.getCode()).isLocked()).isFalse();
	}

	// CON-22
	@Test
	void testGivenCancelledLoading_whenGameFinishes_thenMembersReceiveTheParty() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_CANCELLED, this.game));

		assertThat(this.userClient.getRecipients()).containsExactlyElementsOf(this.party.getUsers());
	}

	// ABSENT-3
	@Test
	void testGivenDeletedMember_whenReleaseRuns_thenTheyAreNoLongerMembers() throws Exception {
		User member = new User("user-2", "Name", UserPlatform.WEB);
		this.party.setCurrentGame(GameCode.NONE);
		this.party.add(member);
		this.party.setCurrentGame(this.game.getCode());
		this.party.removeWhenUnlocked(member.getCode());
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		this.scheduler.runScheduledTask();

		assertThat(this.partyRepository.find(this.party.getCode()).has(member)).isFalse();
	}

	// PARTY-8
	@Test
	void testGivenEveryMemberDeleted_whenReleaseRuns_thenThePartyIsRemoved() {
		this.party.removeWhenUnlocked(this.party.getOwner().getCode());
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		this.scheduler.runScheduledTask();

		assertThat(this.partyRepository.has(this.party.getCode())).isFalse();
	}

	@Test
	void testGivenPartyWithPendingRelease_whenDiscardGameOf_thenTheWaitIsCancelled() {
		this.service.releasePartiesWhenGameFinishes(new Event(EventCode.GAME_END, this.game));

		this.service.discardGameOf(this.party);

		assertThat(this.scheduler.getFuture().isCancelled()).isTrue();
	}

	@Test
	void testGivenPartyWithGame_whenDiscardGameOf_thenTheGameIsRemoved() {
		this.service.discardGameOf(this.party);

		assertThat(this.gameRepository.exists(this.game.getCode())).isFalse();
	}
}
