package com.dainws.games.cbg.domain.player.actions;

import com.dainws.games.cbg.domain.exception.PlayerActionException;

public interface Action {
	void perform() throws PlayerActionException;
}
