package com.dainws.games.crm.configuration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.domain.mode.GameModeFactory;

@Configuration
public class GeneralConfiguration {

	@Bean("availableGameModes")
	List<GameMode> availableGameModes(List<GameModeFactory> gameModeFactories) {
		List<GameMode> availableGameModes = new ArrayList<>();
		for (GameModeFactory gameModeFactory : gameModeFactories) {
			availableGameModes.add(gameModeFactory.getMode());
		}

		return availableGameModes;
	}

	@Bean
	PlayerActionFacade playerActionFacade(ActionContextFactory actionContextFactory) {
		return new PlayerActionFacade(actionContextFactory);
	}

	@Bean
	GameLifeCycle gameLifeCycle() {
		return new GameLifeCycle();
	}
}
