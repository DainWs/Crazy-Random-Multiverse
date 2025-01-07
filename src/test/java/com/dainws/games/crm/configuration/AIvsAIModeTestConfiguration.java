package com.dainws.games.crm.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.mode.aivsai.AIvsAIEventDispatcher;
import com.dainws.games.crm.domain.mode.aivsai.AIvsAIGameModeFactory;

@TestConfiguration
public class AIvsAIModeTestConfiguration {

	@Autowired
	private EventPublisher eventPublisher;
	
	@Autowired
	private ExceptionPublisher exceptionPublisher;
	
	@Bean
	AIvsAIGameModeFactory aivsaiGameModeFactory(Deck deck) {
		AIvsAIGameModeFactory factory = new AIvsAIGameModeFactory(deck);
		factory.setEventPublisher(this.eventPublisher);
		factory.setExceptionPublisher(this.exceptionPublisher);
		return factory;
	}

	@Bean
	AIvsAIEventDispatcher aivsaiEventDispatcher() {
		return new AIvsAIEventDispatcher();
	}
}
