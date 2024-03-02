package com.dainws.games.crm.configuration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.crm.configuration.jpa.MemoryCardRepositoryPopulator;
import com.dainws.games.crm.domain.CardRepository;
import com.dainws.games.crm.domain.GameRepository;
import com.dainws.games.crm.domain.PartyRepository;
import com.dainws.games.crm.domain.UserRepository;
import com.dainws.games.crm.persistence.JPAActionContextFactory;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

@Configuration(proxyBeanMethods = false)
public class JPAConfiguration {
	@Bean(name = "GameRepository")
	@ConditionalOnMissingBean(GameRepository.class)
	MemoryGameRepository gameRepository() {
		return new MemoryGameRepository();
	}
	
	@Bean(name = "CardRepository")
	@ConditionalOnMissingBean({ CardRepository.class, Deck.class })
	MemoryCardRepository cardRepository() {
		MemoryCardRepository cardRepository = new MemoryCardRepository();
		new MemoryCardRepositoryPopulator().populate(cardRepository);
		return cardRepository;
	}
	
	@Bean(name = "PartyRepository")
	@ConditionalOnMissingBean(PartyRepository.class)
	MemoryPartyRepository partyRepository() {
		return new MemoryPartyRepository();
	}
	
	@Bean(name = "UserRepository")
	@ConditionalOnMissingBean(UserRepository.class)
	MemoryUserRepository userRepository() {
		return new MemoryUserRepository();
	}
	
	@Bean
	JPAActionContextFactory jPAActionContextFactory(
			GameRepository gameRepository, CardRepository cardRepository) {
		return new JPAActionContextFactory(gameRepository, cardRepository);
	}
}
