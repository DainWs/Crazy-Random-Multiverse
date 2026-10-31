package com.dainws.games.crm.persistence.memory;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;

class MemoryUserRepositoryTest {

	private static final int USERS = 500;

	@Test
	void testGivenNullCode_whenHas_thenIsFalse() {
		MemoryUserRepository repository = new MemoryUserRepository();

		assertThat(repository.has(null)).isFalse();
	}

	@Test
	void testGivenSavedUsers_whenFindAll_thenReturnsAllOfThem() {
		MemoryUserRepository repository = new MemoryUserRepository();
		User first = new User("user-1", "Name", UserPlatform.WEB);
		User second = new User("user-2", "Name", UserPlatform.WEB);
		repository.save(first);
		repository.save(second);

		assertThat(repository.findAll()).containsExactlyInAnyOrder(first, second);
	}

	@Test
	void testGivenSavesFromSeveralThreads_whenHas_thenEveryUserIsKept() {
		MemoryUserRepository repository = new MemoryUserRepository();
		List<User> users = IntStream.range(0, USERS) //
				.mapToObj(number -> new User("user-" + number, "Name", UserPlatform.WEB)) //
				.toList();

		users.parallelStream().forEach(repository::save);

		boolean hasEveryUser = users.stream() //
				.allMatch(user -> repository.has(user.getCode()));
		assertThat(hasEveryUser).isTrue();
	}
}
