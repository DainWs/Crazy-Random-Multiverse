package com.dainws.games.crm.domain.core;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Stream;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import com.dainws.games.crm.domain.builder.GameBuilder;

class GameLifeCycleConcurrencyTest {

	private static final int THREADS = 8;
	private static final int GAMES = 1000;

	ExecutorService executor;

	@BeforeEach
	void beforeEach() {
		this.executor = Executors.newFixedThreadPool(THREADS);
	}

	@AfterEach
	void afterEach() {
		this.executor.shutdownNow();
	}

	// BACKEND-CODESTYLE 16: the games of different parties are created at the same time
	@Test
	@Timeout(30)
	void testGivenSeveralGamesAtOnce_whenRegister_thenNoGameIsLost() throws Exception {
		GameLifeCycle gameLifeCycle = new GameLifeCycle();
		List<Game> games = Stream.generate(() -> new GameBuilder().withNRandomPlayers(2).build())
				.limit(GAMES)
				.toList();
		CountDownLatch start = new CountDownLatch(1);
		List<Future<Boolean>> registrations = games.stream()
				.map(game -> this.executor.submit(() -> {
					start.await();
					return gameLifeCycle.register(game, player -> true);
				}))
				.toList();

		start.countDown();
		for (Future<Boolean> registration : registrations) {
			registration.get();
		}

		long lostGames = games.stream().filter(game -> gameLifeCycle.register(game, player -> true)).count();
		assertEquals(0, lostGames);
	}
}
