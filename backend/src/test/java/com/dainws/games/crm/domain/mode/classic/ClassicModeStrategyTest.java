package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

class ClassicModeStrategyTest {

	private static final long SEED = 7L;
	private static final int USERS = 6;
	private static final int FIRST_SEAT = 0;

	private Party party;
	private MemoryCardRepository deck;
	private ClassicModeStrategy strategy;

	@BeforeEach
	void beforeEach() throws NotAllowedException {
		this.party = this.createParty();
		this.deck = new MemoryCardRepository();
		this.deck.set(new Leader(0));
		this.deck.set(new Leader(1));
		this.strategy = new ClassicModeStrategy(this.party, this.deck);
		this.strategy.setRandom(new Random(SEED));
	}

	@Test
	void testGivenAnyPlayers_whenCreateTurn_thenTheStartingPlayerIsTheFirstSeat() {
		Turn turn = this.strategy.createTurn(this.createPlayers());

		assertThat(turn.getTurnNumber()).isEqualTo(FIRST_SEAT);
	}

	@Test
	void testGivenAnyPlayers_whenCreateTurn_thenRoundIsTheStartingOne() {
		Turn turn = this.strategy.createTurn(this.createPlayers());

		assertThat(turn.getRoundNumber()).isEqualTo(ClassicModeStrategy.STARTING_ROUND);
	}

	@Test
	void testGivenAParty_whenCreatePlayerStorage_thenEveryUserHasASeat() {
		PlayerStorage players = this.strategy.createPlayerStorage();

		assertThat(players).extracting(Player::getCode) //
				.containsExactlyInAnyOrderElementsOf(this.partyUserCodes());
	}

	@Test
	void testGivenSameSeed_whenCreatePlayerStorageTwice_thenTheOrderIsTheSame() {
		PlayerStorage first = this.strategy.createPlayerStorage();
		this.strategy.setRandom(new Random(SEED));
		PlayerStorage second = this.strategy.createPlayerStorage();

		assertThat(second).extracting(Player::getCode) //
				.containsExactlyElementsOf(first.stream().map(Player::getCode).toList());
	}

	@Test
	void testGivenAPlayer_whenCreateBoard_thenItsLeaderIsAlreadyInTheLeaderSlot() {
		PlayerStorage players = this.strategy.createPlayerStorage();

		Board board = this.strategy.createBoard(players);

		assertThat(board.getZoneOf(players.first()).getCombatant(ZoneWithLeader.LEADER_COORDINATE).isType(CardType.LEADER)) //
				.isTrue();
	}

	@Test
	void testGivenAGame_whenCreateIt_thenEveryZoneHasItsLeader() {
		Game game = new Game(this.strategy);

		assertThat(game.getPlayers()) //
				.allSatisfy(player -> assertThat(game.getPlayerZone(player).getCombatant(ZoneWithLeader.LEADER_COORDINATE)) //
						.isInstanceOf(Leader.class));
	}

	@Test
	void testGivenAGame_whenCreateIt_thenNoPlayerHoldsCardsInHand() {
		Game game = new Game(this.strategy);

		assertThat(game.getPlayers()) //
				.allSatisfy(player -> assertThat(player.getHand().isEmpty()).isTrue());
	}

	private PlayerStorage createPlayers() {
		return new PlayerStorage(List.of(
				new PlayerBuilder().build(), new PlayerBuilder().build(),
				new PlayerBuilder().build(), new PlayerBuilder().build()));
	}

	private Party createParty() throws NotAllowedException {
		User owner = new User("user-0", "user-0", UserPlatform.WEB);
		Party newParty = new Party(owner, GameModes.CLASSIC);
		newParty.setMaxUsers(USERS);
		for (int index = 1; index < USERS; index++) {
			newParty.add(new User("user-" + index, "user-" + index, UserPlatform.WEB));
		}
		return newParty;
	}

	private List<String> partyUserCodes() {
		List<String> codes = new ArrayList<>();
		for (User user : this.party.getUsers()) {
			codes.add(user.getCode().text());
		}
		return codes;
	}
}
