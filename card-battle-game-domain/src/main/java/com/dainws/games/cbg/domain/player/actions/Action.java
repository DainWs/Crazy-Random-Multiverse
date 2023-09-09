package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.player.exception.PlayerActionException;

public interface Action {
	void execute() throws PlayerActionException;
}
