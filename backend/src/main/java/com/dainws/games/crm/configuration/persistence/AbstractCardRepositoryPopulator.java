package com.dainws.games.crm.configuration.persistence;

import com.dainws.games.crm.domain.repositories.CardRepository;

public abstract class AbstractCardRepositoryPopulator<T extends CardRepository> {
	public abstract void populate(T cardRepository);
}
