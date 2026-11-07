package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.LockRecordingPublisher;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.services.exception.AccessDeniedException;

class GameServiceTest {

	GameLifeCycle gameLifeCycle;
	MemoryPartyRepository partyRepository;
	MemoryGameRepository gameRepository;
	GameService gameService;
	User user;

	@BeforeEach
	void beforeEach() {
		this.partyRepository = new MemoryPartyRepository();
		this.gameRepository = new MemoryGameRepository();
		this.gameLifeCycle = new GameLifeCycle();
		this.gameService = new GameService(this.gameLifeCycle, this.gameRepository, List.of());
		this.gameService.setPartyRepository(this.partyRepository);
		this.user = new User("user-1", "Name", UserPlatform.WEB);
	}

	@Test
	void testGivenUserWithoutParty_whenFindActiveGame_thenReturnsEmpty() {
		assertThat(this.gameService.findActiveGameOf(this.user)).isEmpty();
	}

	@Test
	void testGivenPartyWithoutGame_whenFindActiveGame_thenReturnsEmpty() {
		this.partyRepository.save(new Party(this.user, GameModes.CLASSIC));

		assertThat(this.gameService.findActiveGameOf(this.user)).isEmpty();
	}

	@ParameterizedTest
	@EnumSource(value = Status.class, names = { "LOADING", "IN_PROGRESS" })
	void testGivenPartyWithActiveGame_whenFindActiveGame_thenReturnsThatGame(Status status) {
		Game game = this.createGameOfPartyWithStatus(status);

		assertThat(this.gameService.findActiveGameOf(this.user))
				.containsSame(game);
	}

	@ParameterizedTest
	@EnumSource(value = Status.class,
			names = { "NONE", "CREATED", "ENDED" })
	void testGivenPartyWithInactiveGame_whenFindActiveGame_thenReturnsEmpty(Status status) {
		this.createGameOfPartyWithStatus(status);

		assertThat(this.gameService.findActiveGameOf(this.user)).isEmpty();
	}

	@Test
	void testGivenUserOutsideTheGame_whenLoadCompleteFor_thenAccessIsDeniedWithWrongGameKey() {
		Game game = this.createGameOfPartyWithStatus(Status.LOADING);
		PlayerCode outsider = PlayerCode.from("outsider");

		assertThatThrownBy(() -> this.gameService.loadCompleteFor(game.getCode(), outsider))
				.isInstanceOfSatisfying(AccessDeniedException.class,
						exception -> assertThat(exception.getCodeValue()).isEqualTo("exception.access_denied.wrong_game"));
	}

	// The game reacts to the last ready inside the lock,
	// so no action sees the game halfway
	@Test
	void testGivenLastPlayerToLoad_whenLoadCompleteFor_thenTheGameStartsWithTheGameLocked() {
		EventCode watched = EventCode.GAME_START;
		LockRecordingPublisher publisher = new LockRecordingPublisher(watched);
		Game game = this.createLoadingGameOfTheUser(publisher);
		String userCode = this.user.getCode().text();

		this.gameService.loadCompleteFor(game.getCode(), PlayerCode.from(userCode));

		assertEquals(List.of(true), publisher.getLockedWhenPublished());
	}

	@Test
	void testGivenLoadingGameWithTwoPlayers_whenOneIsEliminated_thenTheLoadingIsCancelledWithTheGameLocked() {
		EventCode watched = EventCode.GAME_CANCELLED;
		LockRecordingPublisher publisher = new LockRecordingPublisher(watched);
		this.createLoadingGameOfTheUser(publisher);

		this.gameService.eliminate(this.user);

		assertEquals(List.of(true), publisher.getLockedWhenPublished());
	}

	// CON-22
	@Test
	void testGivenOneLivingPlayer_whenPlayerDie_thenGameEnds() {
		Game game = this.createGameWithOneLivingPlayer();

		this.gameService.updateEventGame(new Event(EventCode.PLAYER_DIE, new EventDetails(game)));

		assertThat(game.hasEnded()).isTrue();
	}

	// CON-22
	@Test
	void testGivenOneLivingPlayer_whenPlayerSurrender_thenGameKeepsRunning() {
		Game game = this.createGameWithOneLivingPlayer();

		this.gameService.updateEventGame(new Event(EventCode.PLAYER_SURRENDER, new EventDetails(game)));

		assertThat(game.hasEnded()).isFalse();
	}

	private Game createLoadingGameOfTheUser(LockRecordingPublisher publisher) {
		Game game = new GameBuilder() //
				.withPlayers(new UserPlayer(this.user), new PlayerBuilder().build()) //
				.withEventPublisher(publisher) //
				.build();
		publisher.setGame(game);
		this.gameLifeCycle.register(game, player -> player instanceof UserPlayer);
		this.gameLifeCycle.startLoading(game);
		this.gameRepository.save(game);

		Party party = new Party(this.user, GameModes.CLASSIC);
		party.setCurrentGame(game.getCode());
		this.partyRepository.save(party);
		return game;
	}

	private Game createGameWithOneLivingPlayer() {
		Game game = new GameBuilder().withNRandomPlayers(2).build();
		game.getPlayers().get(0).die();
		return game;
	}

	private Game createGameOfPartyWithStatus(Status status) {
		Game game = new GameBuilder() //
				.withPlayers(new UserPlayer(this.user), new PlayerBuilder().build()) //
				.build();
		GameStatusSetter.setStatus(game, status);
		this.gameRepository.save(game);

		Party party = new Party(this.user, GameModes.CLASSIC);
		party.setCurrentGame(game.getCode());
		this.partyRepository.save(party);
		return game;
	}
}
