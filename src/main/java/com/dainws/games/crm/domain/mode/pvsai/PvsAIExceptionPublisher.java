package com.dainws.games.crm.domain.mode.pvsai;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.exception.CompositeExceptionPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.player.Player;

public class PvsAIExceptionPublisher extends CompositeExceptionPublisher {

	private Logger logger;
	
	public PvsAIExceptionPublisher(ExceptionPublisher exceptionPublisher) {
		super(exceptionPublisher);
		this.logger = Logger.getLogger("PvsAI Exception publisher");
	}

	@Override
	public void publish(List<Player> to, ExceptionCode exceptionCode) {
		List<Player> nonAIPlayers = new ArrayList<>();
		
		for (Player player : to) {
			if (this.isNotAIPlayer(player)) {
				nonAIPlayers.add(player);
			} else {
				this.logAIExceptionCode(player, exceptionCode);
			}
		}

		super.publish(nonAIPlayers, exceptionCode);
	}

	@Override
	public void publish(Player to, ExceptionCode exceptionCode) {
		if (this.isNotAIPlayer(to)) {
			super.publish(to, exceptionCode);
		} else {
			this.logAIExceptionCode(to, exceptionCode);
		}
	}

	private boolean isNotAIPlayer(Player player) {
		return !(player instanceof AIPlayer);
	}
	
	private void logAIExceptionCode(Player aiPlayer, ExceptionCode exceptionCode) {
		this.logger.log(Level.SEVERE, "AI Exception handled: %s", exceptionCode.value());
	}
}
