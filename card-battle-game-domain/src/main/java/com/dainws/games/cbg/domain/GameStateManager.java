package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.event.ConsoleEventPublisher;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.event.EventPublisher;
import com.dainws.games.cbg.domain.event.EventTrigger;
import com.dainws.games.cbg.domain.player.Player;

public class GameStateManager implements EventTrigger {
	private EventPublisher eventPublisher;

	public GameStateManager() {
		this.eventPublisher = new ConsoleEventPublisher();
	}

	public void next(Game game) {
		if (this.isGameInStartState(game)) {
			this.doStartStateProcess(game);
		}

		if (this.isGameInEndState(game)) {
			this.doEndStateProcess(game);
		}
	}

	private boolean isGameInStartState(Game game) {
		return game.getRound() < 0;
	}

	private void doStartStateProcess(Game game) {
		this.publishGameEvent(EventCode.GAME_START, game);
	}

	private boolean isGameInEndState(Game game) {
		return this.getCountOfAlivePlayersIn(game) <= 1;
	}

	private void doEndStateProcess(Game game) {
		int alivePlayersCount = this.getCountOfAlivePlayersIn(game);

		if (alivePlayersCount == 1) {
			this.publishGameEvent(EventCode.GAME_END_WITH_WINNER, game);
		}

		this.publishGameEvent(EventCode.GAME_END_WITH_TIE, game);
	}

	private int getCountOfAlivePlayersIn(Game game) {
		int alivePlayersCount = 0;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				alivePlayersCount++;
			}
		}

		return alivePlayersCount;
	}

	private void publishGameEvent(EventCode eventCode, Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		if (EventCode.GAME_END_WITH_WINNER.equals(eventCode)) {
			details.setTargetPlayer(this.getWinnerIn(game));
		}

		this.eventPublisher.publish(new Event(eventCode, details));
	}

	private Player getWinnerIn(Game game) {
		Player winner = null;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				winner = player;
			}
		}

		return winner;
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
