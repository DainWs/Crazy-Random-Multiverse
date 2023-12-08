package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.communication.GameEventTrigger;
import com.dainws.games.cbg.domain.communication.PlayerEventTrigger;
import com.dainws.games.cbg.domain.exception.PlayerActionException;

public interface Action extends GameEventTrigger, PlayerEventTrigger {
	void perform(ActionContext context) throws PlayerActionException;
}
