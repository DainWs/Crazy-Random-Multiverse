package com.dainws.games.crm.console.factories.game;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.crm.console.domain.models.Party;

interface AbstractGameFactory {
	Game create(Party party);
}
