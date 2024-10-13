package com.dainws.games.crm;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.dainws.games.crm.configuration.AIvsAIModeTestConfiguration;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.mode.AbstractGameModeIntegrationTest;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.mode.aivsai.AIvsAIGameModeFactory;
import com.dainws.games.crm.event.GameEventWatcher;

/**
 * This test simulates a full game in classic mode between two AIs.
 * 
 * This test is used to check:
 * <ul>
 * <li>The behavior, actions and decisions logic of the AI</li>
 * <li>The correct functioning of the game flow</li>
 * <li>The implementation of different game modes</li>
 * </ul>
 */
@SpringBootTest
@Import(AIvsAIModeTestConfiguration.class)
public class AIvsAIGameIntegationTest extends AbstractGameModeIntegrationTest {

	@Autowired
	AIvsAIGameModeFactory gameFactory;
	
	@Autowired
	GameEventWatcher eventWatcher; 

	// TODO la AI se esta marcandose un h0m1c1di
	
	@Test
	void testGivenGame_whenStartGame_thenGameShouldEnd() throws InterruptedException {
		this.startGame();
		this.eventWatcher.waitForGameEnd(this.game.getCode(), 0);
	}

	@Test
	void testGivenStartedGame_whenGameEnd_thenEndWithoutProblems() throws InterruptedException {
		this.startGame();
		this.eventWatcher.waitForGameEnd(this.game.getCode());
	}

	@Override
	protected GameModeFactory createGameModeFactory() {
		return this.gameFactory;
	}
}
