package com.dainws.games.crm.domain.mode;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;

public interface GameModeFactory {

	GameMode getMode();

	Game createGame(Party party) throws NotAllowedException;

	Game createGame(Party party, Deck deck) throws NotAllowedException;
}
