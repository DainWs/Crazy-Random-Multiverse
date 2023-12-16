package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.persistence.GameRepository;
import com.dainws.games.crm.persistence.PartyRepository;
import com.dainws.games.crm.persistence.UserRepository;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

@Configuration
public class PersistenceConfiguration {

	@Bean
	public GameRepository getGameRepository() {
		return new MemoryGameRepository();
	}

	@Bean
	public PartyRepository getPartyRepository() {
		return new MemoryPartyRepository();
	}

	@Bean
	public UserRepository getUserRepository() {
		return new MemoryUserRepository();
	}
}
