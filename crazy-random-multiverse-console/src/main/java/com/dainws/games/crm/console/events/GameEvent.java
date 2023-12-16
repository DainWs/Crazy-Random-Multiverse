package com.dainws.games.crm.console.events;

import org.springframework.context.ApplicationEvent;

import com.dainws.games.cbg.domain.Game;

public class GameEvent extends ApplicationEvent {

	private static final long serialVersionUID = 1478648322956832740L;

	private EventKey key;
	
	private GameEvent(Game game, EventKey key) {
		super(game);
		this.key = key;
	}

	@Override
	public Game getSource() {
		return Game.class.cast(super.getSource());
	}
	
	public EventKey getKey() {
		return key;
	}
	
	public static GameEvent newStartGameEvent(Game game) {
		return new GameEvent(game, EventKey.GAME_START_EVENT);
	}
	
	public static GameEvent newEndGameEvent(Game game) {
		return new GameEvent(game, EventKey.GAME_END_EVENT);
	}
}
