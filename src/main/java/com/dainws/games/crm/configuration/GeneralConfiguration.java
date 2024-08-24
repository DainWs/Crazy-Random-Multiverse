package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.ActionFacade;
import com.dainws.games.crm.domain.EventBasedGameStateManager;
import com.dainws.games.crm.domain.EventBasedGameTimeManager;
import com.dainws.games.crm.domain.EventBasedPlayerStateManager;
import com.dainws.games.crm.domain.core.GameStateManager;
import com.dainws.games.crm.domain.core.GameTimeManager;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.PlayerStateManager;

@Configuration
public class GeneralConfiguration {
	@Bean
	public ActionFacade actionFacade(ActionContextFactory actionContextFactory) {
		return new ActionFacade(actionContextFactory);
	}

	@Bean
	public Dealer dealer(Deck deck) {
		return new Dealer(deck);
	}

	@Bean
	public GameTimeManager gameTimeManager() {
		return new EventBasedGameTimeManager();
	}

	@Bean
	public PlayerStateManager playerStateManager() {
		return new EventBasedPlayerStateManager();
	}
	
	@Bean
	public GameStateManager gameStateManager() {
		return new EventBasedGameStateManager();
	}
}
