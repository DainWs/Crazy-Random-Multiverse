package com.dainws.games.cbg.domain.actions;

import com.dainws.games.cbg.domain.exception.PlayerActionException;

public interface Action {
	void perform(ActionContext context) throws PlayerActionException;
}
