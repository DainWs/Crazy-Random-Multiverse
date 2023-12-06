package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.exception.PlayerActionException;

public interface Action {
	void perform(ActionContext context) throws PlayerActionException;
}
