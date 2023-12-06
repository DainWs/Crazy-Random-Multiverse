package com.dainws.games.cbg.domain.player;

import java.util.Objects;

import com.dainws.games.cbg.domain.card.Combatant;

class Square {
	private Position position;
	private Combatant combatant;

	public Square(Position position) {
		this.position = position;
	}

	public boolean isPosition(Position position) {
		return this.position.equals(position);
	}

	public boolean hasCombatant() {
		return this.combatant != null;
	}

	public void putCombatant(Combatant combatant) {
		this.combatant = combatant;
	}

	public void removeCombatant() {
		this.combatant = null;
	}

	public Combatant getCombatant() {
		return this.combatant;
	}

	public Position getPosition() {
		return position;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || obj.getClass() != this.getClass())
			return false;

		Square that = (Square) obj;
		return this.position.equals(that.position);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.position);
	}

	@Override
	public String toString() {
		return "[Position=%s,Warrior=%s]".formatted(this.position, this.combatant);
	}
}
