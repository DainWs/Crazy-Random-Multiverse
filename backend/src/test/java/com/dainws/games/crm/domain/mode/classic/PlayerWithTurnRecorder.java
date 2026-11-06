package com.dainws.games.crm.domain.mode.classic;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.player.Player;

public class PlayerWithTurnRecorder implements EventPublisher {

	private final Game game;
	private final List<Player> playersWithTurn;

	public PlayerWithTurnRecorder(Game game) {
		this.game = game;
		this.playersWithTurn = new ArrayList<>();
	}

	@Override
	public void publish(EventCode code) {
		this.playersWithTurn.add(this.game.getPlayerWithTurn());
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.playersWithTurn.add(this.game.getPlayerWithTurn());
	}

	@Override
	public void publish(Event event) {
		this.playersWithTurn.add(this.game.getPlayerWithTurn());
	}

	public List<Player> getPlayersWithTurn() {
		return this.playersWithTurn;
	}
}
