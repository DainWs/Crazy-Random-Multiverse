package com.dainws.games.crm.domain.event;

public enum EventCode {
	GAME_CREATED,
	GAME_START, GAME_END_WITH_WINNER, GAME_END_WITH_TIE,
	TURN_CHANGE, ROUND_CHANGE,
	
	PLAYER_DIE,
	PLAYER_RECEIVE_CARD,
	PLAYER_PUT_CARD, PLAYER_MOVE_CARD,
	PLAYER_ATTACK_CARD, PLAYER_EQUIP_CARD,
	PLAYER_USE_SPELL, PLAYER_PASS_TURN;
}