package com.dainws.games.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.domain.CardRepository;
import com.dainws.games.crm.domain.GameRepository;
import com.dainws.games.crm.persistence.action.JPAActionContextFactory;

@Configuration(proxyBeanMethods = false)
public class JPAConfiguration {
	/*
	@Bean
	JPAActionContextFactory actionContextFactory(
			GameRepository gameRepository, CardRepository cardRepository) {
		return new JPAActionContextFactory(gameRepository, cardRepository);
	}
	*/
}
