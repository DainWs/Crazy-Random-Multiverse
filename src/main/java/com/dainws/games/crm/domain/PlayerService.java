package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;

public class PlayerService implements EventTrigger {

	private EventPublisher eventPublisher;

	public PlayerService() {
		this.eventPublisher = EventPublisher.NONE;
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
