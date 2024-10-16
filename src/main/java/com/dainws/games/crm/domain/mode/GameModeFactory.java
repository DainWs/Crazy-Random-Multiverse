package com.dainws.games.crm.domain.mode;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;

public interface GameModeFactory {

	GameMode getMode();

	Game createGame(Party party);
}
