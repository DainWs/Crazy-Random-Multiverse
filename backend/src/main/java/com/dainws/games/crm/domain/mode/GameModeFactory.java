package com.dainws.games.crm.domain.mode;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;

public interface GameModeFactory {

	GameMode getMode();

	Game createGame(Party party);

	Game createGame(Party party, Deck deck);
}
