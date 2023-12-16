package com.dainws.games.crm.console.events;

import org.springframework.context.ApplicationEvent;

import com.dainws.games.cbg.domain.player.Player;

public class PlayerEvent extends ApplicationEvent {

	private static final long serialVersionUID = 7148640131365635194L;

	private EventKey key;
	
	private PlayerEvent(Player player, EventKey key) {
		super(player);
		this.key = key;
	}

	@Override
	public Player getSource() {
		return Player.class.cast(super.getSource());
	}
	
	public EventKey getKey() {
		return key;
	}
	
	public static PlayerEvent newPlayerWinEvent(Player player) {
		return new PlayerEvent(player, EventKey.PLAYER_WIN);
	}
	
	public static PlayerEvent newPlayerLoseEvent(Player player) {
		return new PlayerEvent(player, EventKey.PLAYER_LOSE);
	}
	
	public static PlayerEvent newPlayerGetTurnEvent(Player player) {
		return new PlayerEvent(player, EventKey.PLAYER_GET_TURN);
	}
	
	public static PlayerEvent newPlayerGetCardsEvent(Player player) {
		return new PlayerEvent(player, EventKey.PLAYER_GET_CARDS);
	}
	
	public static PlayerEvent newPlayerPutCardEvent(Player player) {
		return new PlayerEvent(player, EventKey.PLAYER_PUT_CARD);
	}
}
