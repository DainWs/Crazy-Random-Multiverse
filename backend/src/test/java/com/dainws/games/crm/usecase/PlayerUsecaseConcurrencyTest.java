package com.dainws.games.crm.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.usecase.dto.ActionDto;
import com.dainws.games.crm.usecase.dto.ActionType;

class PlayerUsecaseConcurrencyTest {

	private static final String USER_CODE = "user-1";
	private static final int THREADS = 8;
	private static final int ACTIONS = 200;

	ExecutorService executor;

	@BeforeEach
	void beforeEach() {
		this.executor = Executors.newFixedThreadPool(THREADS);
	}

	@AfterEach
	void afterEach() {
		this.executor.shutdownNow();
	}

	// BACKEND-CODESTYLE 16: one writer at a time per game
	@Test
	@Timeout(30)
	void testGivenSeveralThreadsActing_whenPerformAction_thenOnlyOneActionRunsAtATime() throws Exception {
		MemoryGameRepository gameRepository = new MemoryGameRepository();
		Game game = new GameBuilder() //
				.withPlayers(new PlayerBuilder().withCode(USER_CODE).build()) //
				.build();
		gameRepository.save(game);
		LockObservingFacade facade = new LockObservingFacade(game);
		PlayerUsecase playerUsecase = new PlayerUsecase(facade, gameRepository);
		User user = new User(USER_CODE, "name", UserPlatform.WEB);
		ActionDto actionDto = new ActionDto();
		actionDto.setGameCode(game.getCode().text());
		actionDto.setType(ActionType.PASS_TURN);
		actionDto.setSourcePlayerCode(USER_CODE);
		GameCode gameCode = game.getCode();
		CountDownLatch start = new CountDownLatch(1);
		Callable<Object> passTurn = () -> {
			start.await();
			return playerUsecase.performAction(gameCode, user, actionDto);
		};
		List<Callable<Object>> actions = Collections.nCopies(ACTIONS, passTurn);

		List<Future<Object>> results = actions.stream().map(this.executor::submit).toList();
		start.countDown();
		for (Future<Object> result : results) {
			result.get();
		}

		assertEquals(1, facade.getMostPerformingAtOnce());
	}
}
