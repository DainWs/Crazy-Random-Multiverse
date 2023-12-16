package com.dainws.games.crm.configuration.auto.cards;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.crm.persistence.CardRepository;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

@AutoConfiguration
@ConditionalOnMissingBean(CardRepository.class)
public class CardAutoConfiguration {
	
	@Configuration(proxyBeanMethods = false)
	protected static class MemoryCardConfiguration {
	
		@Bean
		@ConditionalOnMissingBean
		public MemoryCardRepositoryConfigurer memoryCardRepositoryConfigurer() {
			return new MemoryCardRepositoryConfigurer();
		}
		
		@Bean
		@ConditionalOnMissingBean
		public CardRepository memoryCardRepository(MemoryCardRepositoryConfigurer configurer) {
			MemoryCardRepository cardRepository = new MemoryCardRepository();
			configurer.configure(cardRepository);
			return cardRepository;
		}
		
	}
}
