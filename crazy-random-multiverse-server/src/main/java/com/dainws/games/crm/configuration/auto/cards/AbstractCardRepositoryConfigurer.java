package com.dainws.games.crm.configuration.auto.cards;

import com.dainws.games.crm.persistence.CardRepository;

public abstract class AbstractCardRepositoryConfigurer<T extends CardRepository> {
	public abstract void configure(T cardRepository);
}
