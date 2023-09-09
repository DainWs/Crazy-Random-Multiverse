package com.dainws.games.cbg.domain.effect;

import java.util.Objects;

public class EffectId {
	private final long number;

	public EffectId(long number) {
		this.number = number;
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
}
