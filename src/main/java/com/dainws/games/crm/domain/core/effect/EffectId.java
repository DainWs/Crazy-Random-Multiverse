package com.dainws.games.crm.domain.core.effect;

import java.util.Objects;

public class EffectId {
	public static final EffectId NONE = new EffectId(-1);
	
	private final long number;

	private EffectId(long number) {
		this.number = number;
	}

	public boolean isPresent() {
		return this.number >= 0;
	}
	
	public long getNumber() {
		return this.number;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (obj == null || obj.getClass() != this.getClass())
			return false;
		
		EffectId that = (EffectId) obj;
		return this.number == that.number;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.number);
	}
	
	public static EffectId from(long number) {
		if (number <= -1) {
			return NONE;
		}

		return new EffectId(number); 
	}
}
