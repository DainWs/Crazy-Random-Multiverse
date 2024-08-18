package com.dainws.games.crm.domain.core.effect;

import com.dainws.games.crm.domain.translator.Text;

public class EffectDescription {
	private EffectId id;
	private Text name;
	private Text description;
	
	public EffectDescription(EffectId id, Text name, Text description) {
		this.id = id;
		this.name = name;
		this.description = description;
	}
	
	public EffectId getId() {
		return id;
	}
	
	public Text getName() {
		return name;
	}
	
	public Text getDescription() {
		return description;
	}
	
	@Override
	public String toString() {
		return this.name.toString();
	}
}
