package com.dainws.games.crm.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.controller.events.SpringGameEventDispatcher;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.mode.GameModeEventDispatcher;
import com.dainws.games.crm.domain.mode.classic.ClassicEventDispatcher;
import com.dainws.games.crm.domain.mode.classic.ClassicGameModeFactory;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIEventDispatcher;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGameModeFactory;

@Configuration
public class GameModeConfiguration {

	@Bean
	SpringGameEventDispatcher springGameEventDispatcher(List<GameModeEventDispatcher> dispatchers) {
		return new SpringGameEventDispatcher(dispatchers);
	}

	@Bean
	ClassicEventDispatcher classicEventDispatcher() {
		return new ClassicEventDispatcher();
	}

	@Bean
	ClassicGameModeFactory classicGameModeFactory(Deck deck) {
		return new ClassicGameModeFactory(deck);
	}

	@Bean
	PvsAIEventDispatcher pvsaiEventDispatcher() {
		return new PvsAIEventDispatcher();
	}

	@Bean
	PvsAIGameModeFactory pvsaiGameModeFactory(Deck deck) {
		return new PvsAIGameModeFactory(deck);
	}
}
