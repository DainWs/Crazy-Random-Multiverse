package com.dainws.games.cbg.domain.player;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.cbg.domain.card.Combatant;

public class Zone {
	private Square leaderSquare;
	private Map<LinePosition, Line> lines;

	public Zone() {
		this.leaderSquare = new Square(Position.LEADER_POSITION);
		this.lines = new EnumMap<>(LinePosition.class);

		for (LinePosition linePosition : LinePosition.values()) {
			this.lines.put(linePosition, new Line(linePosition));
		}
	}

	public boolean hasCombatant(Position position) {
		if (position.isFrom(LinePosition.LEADER)) {
			return this.leaderSquare.hasCombatant();
		}

		Square targetSquare = this.getSquareFrom(position);
		return targetSquare.hasCombatant();
	}

	public boolean isLineFull(LinePosition linePosition) {
		if (LinePosition.LEADER.equals(linePosition)) {
			return this.leaderSquare.hasCombatant();
		}

		return this.lines.get(linePosition).isFull();
	}

	public boolean isLineEmpty(LinePosition linePosition) {
		if (LinePosition.LEADER.equals(linePosition)) {
			return !this.leaderSquare.hasCombatant();
		}

		return this.lines.get(linePosition).isEmpty();
	}

	public Combatant getCombatant(Position position) {
		Square square = this.getSquareFrom(position);
		return square.getCombatant();
	}
	
	public void putCombatant(Combatant combatant, Position position) {
		Square square = this.getSquareFrom(position);
		square.putCombatant(combatant);
	}
	
	public void removeCombatant(Position position) {
		Square square = this.getSquareFrom(position);
		square.removeCombatant();
	}
	
	private Square getSquareFrom(Position position) {
		if (position.isFrom(LinePosition.LEADER)) {
			return this.leaderSquare;
		}
		
		Line line = this.lines.get(position.getLinePosition());
		return line.getSquareFrom(position);
	}

	public List<Line> getLines() {
		List<Line> linesList = new ArrayList<>(this.lines.values());
		return Collections.unmodifiableList(linesList);
	}
}
