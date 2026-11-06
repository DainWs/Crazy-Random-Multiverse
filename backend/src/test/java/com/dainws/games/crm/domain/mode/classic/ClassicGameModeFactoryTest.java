package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PartyExceptionCode;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

class ClassicGameModeFactoryTest {

	private Party party;
	private MemoryCardRepository deck;
	private ClassicGameModeFactory factory;

	@BeforeEach
	void beforeEach() {
		User owner = new User("user-1", "Name", UserPlatform.WEB);
		this.party = new Party(owner, GameModes.CLASSIC);
		this.deck = new MemoryCardRepository();
		this.factory = new ClassicGameModeFactory(this.deck);
	}

	@Test
	void testGivenDeckWithoutLeader_whenCreateGame_thenItIsRejectedBecauseOfTheDeck() {
		assertThatThrownBy(() -> this.factory.createGame(this.party)) //
				.isInstanceOfSatisfying(NotAllowedException.class, //
						exception -> assertThat(exception.getCode()).isEqualTo(PartyExceptionCode.DECK_WITHOUT_LEADER));
	}

	@Test
	void testGivenDeckWithLeader_whenCreateGame_thenTheGameIsCreated() throws NotAllowedException {
		this.deck.set(new Leader(0));

		assertThat(this.factory.createGame(this.party)).isNotNull();
	}
}
