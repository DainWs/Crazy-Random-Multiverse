package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.PlayerActionFacade;
import com.dainws.games.crm.domain.core.GameStateManager;
import com.dainws.games.crm.domain.core.GameTimeManager;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.PlayerStateManager;

@Configuration
public class GeneralConfiguration {
	@Bean
	public PlayerActionFacade playerActionFacade(ActionContextFactory actionContextFactory) {
		return new PlayerActionFacade(actionContextFactory);
	}

	@Bean
	public Dealer dealer(Deck deck) {
		return new Dealer(deck);
	}
	
	@Bean
	public GameStateManager gameStateManager() {
		return new GameStateManager();
	}

	@Bean
	public GameTimeManager gameTimeManager() {
		return new GameTimeManager();
	}

	@Bean
	public PlayerStateManager playerStateManager() {
		return new PlayerStateManager();
	}
}
