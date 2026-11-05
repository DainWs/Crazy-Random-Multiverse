package com.dainws.games.crm.domain.resources;

import java.util.ArrayList;
import java.util.List;

public enum AudioKeys {
	PUT(1), DIE(1), ATTACK(3);

	private static final String VARIANT_SEPARATOR = ".";

	private final int variants;

	private AudioKeys(int variants) {
		this.variants = variants;
	}

	public int getVariants() {
		return this.variants;
	}

	public String getKey() {
		return this.name().toLowerCase();
	}

	public List<String> getKeys() {
		if (this.variants == 1) {
			return new ArrayList<>(List.of(this.getKey()));
		}

		List<String> keys = new ArrayList<>();
		for (int variant = 1; variant <= this.variants; variant++) {
			keys.add(this.getKey() + VARIANT_SEPARATOR + variant);
		}
		return keys;
	}
}
