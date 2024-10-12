package com.dainws.games.crm.configuration.jpa;

import com.dainws.games.crm.domain.repositories.CardRepository;

public abstract class AbstractCardRepositoryPopulator<T extends CardRepository> {
	public abstract void populate(T cardRepository);
}
