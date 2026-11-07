package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.services.exception.AccessDeniedException;

class GameServiceTest {

	MemoryPartyRepository partyRepository;
	MemoryGameRepository gameRepository;
	GameService gameService;
	User user;

	@BeforeEach
	void beforeEach() {
		this.partyRepository = new MemoryPartyRepository();
		this.gameRepository = new MemoryGameRepository();
		this.gameService = new GameService(null, this.gameRepository, List.of());
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
