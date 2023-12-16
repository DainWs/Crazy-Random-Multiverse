package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.cbg.domain.communication.Channel;
import com.dainws.games.crm.persistence.CardRepository;
import com.dainws.games.crm.persistence.GameRepository;
import com.dainws.games.crm.services.GameFacade;
import com.dainws.games.crm.services.GameService;
import com.dainws.games.crm.services.PartyService;
import com.dainws.games.crm.services.PlayerFacade;

@Configuration
public class GeneralConfiguration {
	@Bean
	public GameFacade getGameFacade(GameService gameService, PartyService partyService, Channel channel) {
		return new GameFacade(gameService, partyService, channel);
	}

	@Bean
	public PlayerFacade getPlayerFacade(GameRepository gameRepository, CardRepository cardRepository, Channel channel) {
		return new PlayerFacade(gameRepository, cardRepository, channel);
	}
}
