package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.event.ConsoleEventPublisher;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.event.EventPublisher;
import com.dainws.games.cbg.domain.event.EventTrigger;
import com.dainws.games.cbg.domain.player.Player;

public class GameService implements EventTrigger {

	private EventPublisher eventPublisher;

	public GameService() {
		this.eventPublisher = new ConsoleEventPublisher();
	}
	
	public void startGame(Game game) {
		this.publishGameEvent(EventCode.GAME_START, game);
	}

	public void updateAlivePlayersOf(Game game) {
		int alivePlayersCount = 0;
		for (Player player : game.getPlayers()) {
			if (this.shouldPlayerDie(game, player)) {
				player.die();
				this.publishPlayerEvent(EventCode.PLAYER_LOSE, game, player);
			}

			if (!player.isSpectator()) {
				alivePlayersCount++;
			}
		}

		if (alivePlayersCount == 1) {
			Player winner = this.getAlivePlayerOf(game);
			this.publishPlayerEvent(EventCode.PLAYER_WIN, game, winner);
			this.publishGameEvent(EventCode.GAME_END, game);
		}

		if (alivePlayersCount < 1) {
			this.publishGameEvent(EventCode.GAME_TIE, game);
			this.publishGameEvent(EventCode.GAME_END, game);
		}
	}

	private Player getAlivePlayerOf(Game game) {
		return game.getPlayers().stream()
			.filter(p -> !p.isSpectator())
			.findFirst()
			.get();
	}

	private boolean shouldPlayerDie(Game game, Player player) {
		if (player.isSpectator()) {
			return false;
		}

		Board board = game.getBoard();
		double zoneVitality = board.getZoneVitality(player.getPlayerCode());
		return (zoneVitality <= 0);
	}
	
	private void publishGameEvent(EventCode eventCode, Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		this.eventPublisher.publish(new Event(eventCode, details));
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
