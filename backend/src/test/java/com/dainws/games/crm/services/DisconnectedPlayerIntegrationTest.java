package com.dainws.games.crm.services;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.RecordingUserClient;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.domain.core.dealer.MemoryDeckPopulator;
import com.dainws.games.crm.domain.core.event.SynchronousEventPublisher;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.mode.GameEventDispatcher;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.domain.mode.classic.ClassicEventDispatcher;
import com.dainws.games.crm.domain.mode.classic.ClassicGameModeFactory;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

/** The real services, wired by hand: a Spring context would open the port of the Socket.IO server. */
class DisconnectedPlayerIntegrationTest {

	private static final Instant NOW = Instant.parse("2026-01-01T00:00:00Z");
	private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);
	private static final Duration RESULT_DURATION = Duration.ofSeconds(15);
	private static final Instant AFTER_GRACE_PERIOD = NOW.plus(GRACE_PERIOD).plusSeconds(1);
	private static final int FIRST_SEAT = 0;
	private static final int SECOND_SEAT = 1;
	private static final int THIRD_SEAT = 2;

	MemoryUserRepository userRepository;
	ManualTaskScheduler scheduler;
	GameService gameService;
	DisconnectedUserCleaner cleaner;
	Party party;
	Game game;
	User absentUser;

	@BeforeEach
	void beforeEach() throws NotAllowedException {
		this.userRepository = new MemoryUserRepository();
		MemoryPartyRepository partyRepository = new MemoryPartyRepository();
		MemoryGameRepository gameRepository = new MemoryGameRepository();
		RecordingUserClient userClient = new RecordingUserClient();
		this.scheduler = new ManualTaskScheduler();
		Clock clock = Clock.fixed(AFTER_GRACE_PERIOD, ZoneOffset.UTC);

		PartyEventService partyEventService = new PartyEventService(partyRepository, gameRepository, this.scheduler);
		partyEventService.setClock(clock);
		partyEventService.setResultDuration(RESULT_DURATION);
		partyEventService.setUserClient(userClient);

		PartyService partyService = new PartyService(partyRepository);
		partyService.setPartyEventService(partyEventService);
		partyService.setUserClient(userClient);

		SynchronousEventPublisher publisher = new SynchronousEventPublisher();
		ClassicGameModeFactory gameModeFactory = new ClassicGameModeFactory(new MemoryDeckPopulator().populate());
		gameModeFactory.setEventPublisher(publisher);
		this.gameService = new GameService(new GameLifeCycle(), gameRepository, List.of(gameModeFactory));
		this.gameService.setPartyRepository(partyRepository);

		GameEventDispatcher dispatcher = new GameEventDispatcher(List.of(new ClassicEventDispatcher()));
		publisher.subscribe(dispatcher::dispatchEvent);
		publisher.subscribe(this.gameService::updateEventGame);
		publisher.subscribe(partyEventService::releasePartiesWhenGameFinishes);

		UserService userService = new UserService(this.userRepository, partyService);
		userService.setGameService(this.gameService);
		userService.setDisconnectGracePeriod(GRACE_PERIOD);
		userService.setClock(clock);
		this.cleaner = new DisconnectedUserCleaner(userService);

		this.party = this.createPartyOfThree(partyRepository);
		this.game = this.startGame();
		this.absentUser = this.userOf(this.game.getPlayerWithTurn());
		this.absentUser.startWaitingForSocket(NOW);
	}

	// ABSENT-3
	@Test
	void testGivenDisconnectedPlayerWithTurn_whenCleanerRuns_thenPlayerIsEliminated() {
		Player absentPlayer = this.game.getPlayerWithTurn();

		this.cleaner.deleteDisconnectedUsers();

		assertTrue(absentPlayer.isDeath());
	}

	// ELIM-4
	@Test
	void testGivenDisconnectedPlayerWithTurn_whenCleanerRuns_thenTurnPassesToNextLivingPlayer() {
		PlayerStorage seats = this.game.getPlayers();
		assertSame(seats.get(FIRST_SEAT), this.game.getPlayerWithTurn());

		this.cleaner.deleteDisconnectedUsers();

		assertSame(seats.get(SECOND_SEAT), this.game.getPlayerWithTurn());
	}

	// LOAD-1
	@Test
	void testGivenDisconnectedPlayerWithTurn_whenCleanerRuns_thenLockedPartyKeepsThem() {
		this.cleaner.deleteDisconnectedUsers();

		assertTrue(this.party.has(this.absentUser));
	}

	// ABSENT-3, WIN-5
	@Test
	void testGivenDeletedUserAndFinishedGame_whenPartyUnlocks_thenTheyAreNoLongerMembers() {
		this.cleaner.deleteDisconnectedUsers();
		this.gameService.eliminate(this.userOf(this.game.getPlayers().get(THIRD_SEAT)));

		this.scheduler.runScheduledTask();

		assertFalse(this.party.has(this.absentUser));
	}

	private Party createPartyOfThree(MemoryPartyRepository partyRepository) throws NotAllowedException {
		Party createdParty = new Party(this.createUser("user-1"), GameModes.CLASSIC);
		createdParty.add(this.createUser("user-2"));
		createdParty.add(this.createUser("user-3"));
		partyRepository.save(createdParty);
		return createdParty;
	}

	private User createUser(String code) {
		User user = new User(code, "Name", UserPlatform.WEB);
		this.userRepository.save(user);
		return user;
	}

	private Game startGame() throws NotAllowedException {
		Game startedGame = this.gameService.loadPartyGame(this.party);
		for (User user : this.party.getUsers()) {
			this.gameService.loadCompleteFor(startedGame.getCode(), this.playerCodeOf(user));
		}

		return startedGame;
	}

	private User userOf(Player player) {
		return this.party.getUsers().stream()
				.filter(user -> player.isCode(this.playerCodeOf(user)))
				.findFirst()
				.orElseThrow();
	}

	private PlayerCode playerCodeOf(User user) {
		return PlayerCode.from(user.getCode().text());
	}
}
