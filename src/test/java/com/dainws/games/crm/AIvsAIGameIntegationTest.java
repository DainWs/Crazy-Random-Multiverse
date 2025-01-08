package com.dainws.games.crm;

import static org.junit.jupiter.api.Assertions.assertTimeoutPreemptively;

import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.dainws.games.crm.configuration.AIvsAIModeTestConfiguration;
import com.dainws.games.crm.configuration.JPATestConfiguration;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.aivsai.AIvsAIGameStrategy;
import com.dainws.games.crm.event.GameEventWatcher;
import com.dainws.games.crm.persistence.PartyPopulator;
import com.dainws.games.crm.services.GameService;

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
@Import({ AIvsAIModeTestConfiguration.class, JPATestConfiguration.class })
public class AIvsAIGameIntegationTest {

	@Autowired
	GameEventWatcher eventWatcher;

	@Autowired
	GameService gameService;

	@Autowired
	PartyPopulator partyPopulator;

	private Party party;

	@BeforeEach
	void beforeEach() {
		this.party = this.partyPopulator.populate(AIvsAIGameStrategy.AIVSAI_MODE);
	}

	@Test
	void testGivenGame_whenStartGame_thenGameShouldEnd() throws InterruptedException {
		assertTimeoutPreemptively(Duration.ofSeconds(10), this::playGame);
	}
	
	private void playGame() throws InterruptedException {
		Game game = this.gameService.loadPartyGame(this.party);
		System.out.println(game.getMode());
		for (Player player : game.getPlayers()) {
			this.gameService.loadCompleteFor(game.getCode(), player.getPlayerCode());
		}
		
		this.eventWatcher.waitForGameEnd(game.getCode());
	}

}
