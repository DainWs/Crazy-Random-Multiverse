package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.ActionService;
import com.dainws.games.crm.domain.DealerService;
import com.dainws.games.crm.domain.GameStateManager;
import com.dainws.games.crm.domain.PlayerService;
import com.dainws.games.crm.domain.RoundService;
import com.dainws.games.crm.domain.models.action.ActionContextFactory;
import com.dainws.games.crm.domain.models.dealer.Deck;

@Configuration
public class GeneralConfiguration {
	@Bean
	public ActionService actionService(ActionContextFactory actionContextFactory) {
		return new ActionService(actionContextFactory);
	}

	@Bean
	public DealerService dealerService(Deck deck) {
		return new DealerService(deck);
	}

	@Bean
	public RoundService roundService() {
		return new RoundService();
	}

	@Bean
	public PlayerService playerService() {
		return new PlayerService();
	}
	
	@Bean
	public GameStateManager gameStateManager() {
		return new GameStateManager();
	}
}
