package com.dainws.games.crm.services;

public enum FixedResource {
	ICON_DAMAGE_PHYSICAL("icon.damage.physical", "icons/damage-physical.png"),
	ICON_DAMAGE_MAGIC("icon.damage.magic", "icons/damage-magic.png"),
	ICON_DAMAGE_TRUE("icon.damage.true", "icons/damage-true.png"),
	ICON_ARMOR_PHYSICAL("icon.armor.physical", "icons/armor-physical.png"),
	ICON_ARMOR_MAGIC("icon.armor.magic", "icons/armor-magic.png"),
	ICON_HEALTH("icon.health", "icons/health.png"),
	FRAME_COMMON("frame.common", "frames/common.png"),
	FRAME_UNCOMMON("frame.uncommon", "frames/uncommon.png"),
	FRAME_RARE("frame.rare", "frames/rare.png"),
	FRAME_EPIC("frame.epic", "frames/epic.png"),
	FRAME_LEGENDARY("frame.legendary", "frames/legendary.png"),
	FRAME_MYTHIC("frame.mythic", "frames/mythic.png"),
	FRAME_LEADER("frame.leader", "frames/leader.png"),
	FRAME_EQUIPMENT("frame.equipment", "frames/equipment.png"),
	SLOT_WARRIOR("slot.warrior", "slots/warrior.png"),
	SLOT_LEADER("slot.leader", "slots/leader.png"),
	CARD_UNKNOWN("card.unknown", "cards/unknown.png");

	private final String key;
	private final String path;

	private FixedResource(String key, String path) {
		this.key = key;
		this.path = path;
	}

	public String key() {
		return this.key;
	}

	public String path() {
		return this.path;
	}
}
