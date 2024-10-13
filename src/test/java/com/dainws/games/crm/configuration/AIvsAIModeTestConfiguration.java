package com.dainws.games.crm.configuration;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.PlayerActionExecutor;
import com.dainws.games.crm.domain.mode.aivsai.AIvsAIGameModeFactory;

@TestConfiguration
@Import(GameModeTestConfiguration.class)
public class AIvsAIModeTestConfiguration {

	@Bean
	AIvsAIGameModeFactory aivsaiGameModeFactory(Deck deck, PlayerActionExecutor actionExecutor) {
		return new AIvsAIGameModeFactory(deck, actionExecutor);
	}
}
