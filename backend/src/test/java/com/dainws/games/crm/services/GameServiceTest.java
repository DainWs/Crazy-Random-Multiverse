package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.AIPlayerBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;

class GameServiceTest {

	private MemoryPartyRepository partyRepository;
	private MemoryGameRepository gameRepository;
	private GameService gameService;
	private User user;

	@BeforeEach
	void beforeEach() {
		this.partyRepository = new MemoryPartyRepository();
		this.gameRepository = new MemoryGameRepository();
		this.gameService = new GameService(null, this.gameRepository, List.of());
		this.gameService.setPartyRepository(this.partyRepository);
		this.user = new User("user-1", "Name", UserPlatform.WEB);
	}

	@Test
	void testGivenUserWithoutParty_whenFindGameInProgress_thenReturnsEmpty() {
		assertThat(this.gameService.findGameInProgressOf(this.user)).isEmpty();
	}

	@Test
	void testGivenPartyWithoutGame_whenFindGameInProgress_thenReturnsEmpty() {
		this.partyRepository.save(new Party(this.user, GameModes.CLASSIC));

		assertThat(this.gameService.findGameInProgressOf(this.user)).isEmpty();
	}

	@Test
	void testGivenPartyWithGameInProgress_whenFindGameInProgress_thenReturnsThatGame() {
		Game game = this.createGameOfPartyWithStatus(Status.IN_PROGRESS);

		assertThat(this.gameService.findGameInProgressOf(this.user))
				.containsSame(game);
	}

	@ParameterizedTest
	@EnumSource(value = Status.class,
			names = { "NONE", "CREATED", "LOADING", "ENDED" })
	void testGivenPartyWithGameNotInProgress_whenFindGameInProgress_thenReturnsEmpty(Status status) {
		this.createGameOfPartyWithStatus(status);

		assertThat(this.gameService.findGameInProgressOf(this.user)).isEmpty();
	}

	private Game createGameOfPartyWithStatus(Status status) {
		Game game = new GameBuilder() //
				.withPlayers(new UserPlayer(this.user), AIPlayerBuilder.basicAIPlayer()) //
				.build();
		GameStatusSetter.setStatus(game, status);
		this.gameRepository.save(game);

		Party party = new Party(this.user, GameModes.CLASSIC);
		party.setCurrentGame(game.getCode());
		this.partyRepository.save(party);
		return game;
	}
}
