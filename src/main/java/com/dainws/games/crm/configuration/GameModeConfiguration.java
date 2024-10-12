package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.core.player.PlayerActionExecutor;
import com.dainws.games.crm.domain.mode.classic.ClassicGameModeFactory;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGameModeFactory;

@Configuration
public class GameModeConfiguration {

	@Bean
	public PlayerActionExecutor playerActionExecutor() {
		return new PlayerActionExecutor();
	}

	@Bean
	public ClassicGameModeFactory classicGameModeFactory() {
		return new ClassicGameModeFactory();
	}
	
	@Bean
	public PvsAIGameModeFactory pvsaiGameModeFactory() {
		return new PvsAIGameModeFactory(this.playerActionExecutor());
	}
}
