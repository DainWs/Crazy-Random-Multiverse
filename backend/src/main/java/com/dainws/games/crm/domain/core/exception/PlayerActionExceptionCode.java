package com.dainws.games.crm.domain.core.exception;

public class PlayerActionExceptionCode extends ExceptionCode {

	public enum Code {
		GAME_NOT_IN_PROGRESS("game_not_in_progress"),
		ALLOWED_ONLY_ON_TURN("allowed_only_on_turn"),
		SELECTED_CARD_NOT_FOUND("selected_card_not_found"),
		SELECTED_CARD_IS_NOT_COMBATANT("selected_card_is_not_combatant"),
		SELECTED_CARD_IS_NOT_EQUIPMENT("selected_card_is_not_equipment"),
		SELECTED_TARGET_POSITION_ALREADY_HAS_COMBATANT("selected_target_position_already_has_combatant"),
		SELECTED_SOURCE_POSITION_HAS_NONE_COMBATANT("selected_source_position_has_none_combatant"),
		SELECTED_TARGET_ZONE_IS_NOT_SOURCE_ZONE("selected_target_zone_is_not_source_zone"),
		SELECTED_SOURCE_IS_LEADER("selected_source_is_leader"),
		SELECTED_TARGET_POSITION_NOT_ALLOWED("selected_target_position_not_allowed"),
		SELECTED_SOURCE_ATTACK_IN_COOLDOWN("selected_source_attack_in_cooldown"),
		SELECTED_TARGET_IS_PROTECTED("selected_target_is_protected"),
		SELECTED_SOURCE_LEADER_IS_PROTECTED("selected_source_leader_is_protected"),
		SELECTED_TARGET_POSITION_HAS_NONE_COMBATANT("selected_target_position_has_none_combatant"),
		SELECTED_TARGET_IS_OWN("selected_target_is_own"),
		EQUIP_TARGET_NOT_OWNED("equip_target_not_owned"),
		CARD_CANT_BE_USED("card_cant_be_used");

		private final String text;

		Code(String text) {
			this.text = text;
		}

		public String text() {
			return text;
		}
	}

	public PlayerActionExceptionCode(Code code) {
		super("player-action." + code.text());
	}

}
