package com.dainws.games.crm.console.events;

public enum EventKey {
	// Format: [TRIGER]_[EVENT_NAME]_EVENT
	GAME_START_EVENT,
	GAME_END_EVENT,
	
	PLAYER_WIN,
	PLAYER_LOSE,
	PLAYER_GET_TURN,
	PLAYER_GET_CARDS, // DEALER_DEALS_TO_PLAYER
	PLAYER_PUT_CARD;
}
