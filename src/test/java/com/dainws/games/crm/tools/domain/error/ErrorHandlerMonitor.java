package com.dainws.games.crm.tools.domain.error;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.error.Error;
import com.dainws.games.crm.domain.error.GameErrorHandler;

public class ErrorHandlerMonitor extends GameErrorHandler {

	private List<Error> handledErrors;

	public ErrorHandlerMonitor() {
		this.handledErrors = new ArrayList<>();
	}

	@Override
	public void notifyErrorToPlayer(Player player, Error error) {
		if (!this.handledErrors.contains(error)) {
			this.handledErrors.add(error);
		}
	}
	
	public List<Error> getHandledErrors() {
		return this.handledErrors;
	}
	
	public int countHandledErrors() {
		return this.handledErrors.size();
	}
}
