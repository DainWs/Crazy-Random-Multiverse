package com.dainws.games.crm.persistence.memory;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;

class MemoryPartyRepositoryTest {

	private static final int PARTIES = 200;

	@Test
	void testGivenSavesFromSeveralThreads_whenHas_thenEveryPartyIsKept() {
		MemoryPartyRepository repository = new MemoryPartyRepository();
		List<Party> parties = IntStream.range(0, PARTIES) //
				.mapToObj(this::createParty) //
				.toList();

		parties.parallelStream().forEach(repository::save);

		boolean hasEveryParty = parties.stream() //
				.allMatch(party -> repository.has(party.getCode()));
		assertThat(hasEveryParty).isTrue();
	}

	private Party createParty(int number) {
		User owner = new User("user-" + number, "Name", UserPlatform.WEB);
		return new Party(owner, GameModes.CLASSIC);
	}
}
