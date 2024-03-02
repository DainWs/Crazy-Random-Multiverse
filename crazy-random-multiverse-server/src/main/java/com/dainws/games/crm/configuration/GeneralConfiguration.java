package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.cbg.domain.ActionService;
import com.dainws.games.cbg.domain.DealerService;
import com.dainws.games.cbg.domain.GameStateManager;
import com.dainws.games.cbg.domain.PlayerService;
import com.dainws.games.cbg.domain.RoundService;
import com.dainws.games.cbg.domain.action.ActionContextFactory;
import com.dainws.games.cbg.domain.dealer.Deck;

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
