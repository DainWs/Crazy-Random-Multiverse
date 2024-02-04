package com.dainws.games.crm.configuration.auto.jpa;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;

import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.crm.domain.CardRepository;
import com.dainws.games.crm.domain.GameRepository;
import com.dainws.games.crm.domain.PartyRepository;
import com.dainws.games.crm.domain.UserRepository;
import com.dainws.games.crm.persistence.action.JPAActionContextFactory;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

@AutoConfiguration
public class AutoJPAConfiguration {
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
	JPAActionContextFactory actionContextFactory(
			GameRepository gameRepository, CardRepository cardRepository) {
		return new JPAActionContextFactory(gameRepository, cardRepository);
	}
}
