package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.mode.classic.ClassicGameModeFactory;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGameModeFactory;

@Configuration
public class GameModeConfiguration {

	@Bean
	ClassicGameModeFactory classicGameModeFactory(Deck deck) {
		return new ClassicGameModeFactory(deck);
	}
	
	@Bean
	PvsAIGameModeFactory pvsaiGameModeFactory(Deck deck) {
		return new PvsAIGameModeFactory(deck);
	}
}
