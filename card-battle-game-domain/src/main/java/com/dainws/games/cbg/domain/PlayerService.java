package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.event.ConsoleEventPublisher;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.event.EventPublisher;
import com.dainws.games.cbg.domain.event.EventTrigger;
import com.dainws.games.cbg.domain.player.Player;

public class PlayerService implements EventTrigger {

	private EventPublisher eventPublisher;

	public PlayerService() {
		this.eventPublisher = new ConsoleEventPublisher();
	}

	public void updateAlivePlayersOf(Game game) {
		for (Player player : game.getPlayers()) {
			if (this.shouldPlayerDie(game, player)) {
				player.die();
				this.publishPlayerEvent(EventCode.PLAYER_DIE, game, player);
			}
		}
	}

	private boolean shouldPlayerDie(Game game, Player player) {
		if (player.isSpectator()) {
			return false;
		}

		Board board = game.getBoard();
		return board.isZoneAlive(player.getPlayerCode());
	}

	private void publishPlayerEvent(EventCode eventCode, Game game, Player player) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(player);

		this.eventPublisher.publish(new Event(eventCode, details));
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
