package com.dainws.games.cbg.domain.event;

public enum EventCode {
	GAME_CREATED,
	GAME_START, GAME_END_WITH_WINNER, GAME_END_WITH_TIE,
	PLAYER_WIN, PLAYER_LOSE, PLAYER_SURRENDER,
	
	TURN_CHANGE, ROUND_CHANGE,
	
	DEALED_CARD_TO_PLAYER,
	
	PLAYER_PUT_CARD, PLAYER_MOVE_CARD,
	PLAYER_ATTACK_CARD, PLAYER_EQUIP_CARD,
	PLAYER_USE_SPELL, PLAYER_PASS_TURN;
}
