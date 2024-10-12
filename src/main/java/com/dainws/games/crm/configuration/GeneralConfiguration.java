package com.dainws.games.crm.configuration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.PartyService;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.UserService;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.GameStateManager;
import com.dainws.games.crm.domain.core.GameTimeManager;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.domain.core.player.PlayerStateManager;
import com.dainws.games.crm.domain.mode.GameFactory;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.repositories.GameRepository;
import com.dainws.games.crm.domain.repositories.PartyRepository;
import com.dainws.games.crm.domain.repositories.UserRepository;

@Configuration
public class GeneralConfiguration {
	
	@Autowired
	private UserClient userClient;
	
	private GameFactory gameFactory;
	private List<GameMode> availableGameModes;
	
	public GeneralConfiguration(List<GameModeFactory> gameModeFactories) {
		this.gameFactory = new GameFactory(gameModeFactories);
		this.availableGameModes = new ArrayList<>();
		for (GameModeFactory gameModeFactory : gameModeFactories) {
			this.availableGameModes.add(gameModeFactory.getMode());
		}
	}
	
	@Bean("availableGameModes")
	public List<GameMode> availableGameModes() {
		return this.availableGameModes;
	}
	
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

	@Bean
	public PartyService partyService(GameRepository gameRepository, PartyRepository partyRepository) {
		PartyService partyService = new PartyService(gameRepository, partyRepository);
		partyService.setGameStateManager(this.gameStateManager());
		partyService.setUserClient(this.userClient);
		partyService.setGameFactory(this.gameFactory);
		return partyService;
	}

	@Bean
	public UserService userService(UserRepository userRepository, PartyService partyService) {
		return new UserService(userRepository, partyService);
	}
}
