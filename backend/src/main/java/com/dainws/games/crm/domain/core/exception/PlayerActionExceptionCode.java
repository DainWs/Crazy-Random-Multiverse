package com.dainws.games.crm.domain.core.exception;

public class PlayerActionExceptionCode extends ExceptionCode {

	public static final ExceptionCode ALLOWED_ONLY_ON_TURN = new PlayerActionExceptionCode("allowed_only_on_turn");
	public static final ExceptionCode SELECTED_CARD_NOT_FOUND = new PlayerActionExceptionCode("selected_card_not_found");
	public static final ExceptionCode SELECTED_CARD_IS_NOT_COMBATANT = new PlayerActionExceptionCode("selected_card_is_not_combatant");
	public static final ExceptionCode SELECTED_CARD_IS_NOT_EQUIPMENT = new PlayerActionExceptionCode("selected_card_is_not_equipment");
	public static final ExceptionCode SELECTED_TARGET_COORDINATE_IS_NULL = new PlayerActionExceptionCode("selected_target_coordinate_is_null");
	public static final ExceptionCode SELECTED_TARGET_POSITION_ALREADY_HAS_COMBATANT = new PlayerActionExceptionCode("selected_target_position_already_has_combatant");
	public static final ExceptionCode SELECTED_SOURCE_POSITION_HAS_NONE_COMBATANT = new PlayerActionExceptionCode("selected_source_position_has_none_combatant");
	public static final ExceptionCode SELECTED_TARGET_ZONE_IS_NOT_SOURCE_ZONE = new PlayerActionExceptionCode("selected_target_zone_is_not_source_zone");
	public static final ExceptionCode SELECTED_SOURCE_IS_LEADER = new PlayerActionExceptionCode("selected_source_is_leader");
	public static final ExceptionCode SELECTED_TARGET_POSITION_NOT_ALLOWED = new PlayerActionExceptionCode("selected_target_position_not_allowed");
	public static final ExceptionCode SELECTED_SOURCE_ATTACK_IN_COOLDOWN = new PlayerActionExceptionCode("selected_source_attack_in_cooldown");
	public static final ExceptionCode SELECTED_TARGET_IS_PROTECTED = new PlayerActionExceptionCode("selected_target_is_protected");
	public static final ExceptionCode CARD_CANT_BE_USED = new PlayerActionExceptionCode("card_cant_be_used");

	public PlayerActionExceptionCode(String value) {
		super("player-action." + value);
	}

}
