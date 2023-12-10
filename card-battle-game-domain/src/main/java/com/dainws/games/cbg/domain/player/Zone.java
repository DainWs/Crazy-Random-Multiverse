package com.dainws.games.cbg.domain.player;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.PositionEmptyException;
import com.dainws.games.cbg.domain.exception.PositionNotEmptyException;

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

	public Combatant getCombatant(Position position) throws PositionEmptyException {
		Square square = this.getSquareFrom(position);
		if (square.hasCombatant()) {
			return square.getCombatant();
		}
		
		throw new PositionEmptyException();
	}

	public void putCombatant(Combatant combatant, Position position) throws PositionNotEmptyException {
		Square square = this.getSquareFrom(position);
		if (square.hasCombatant()) {
			throw new PositionNotEmptyException();
		}
		
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

	public Map<Position, Combatant> getPositions() { // TODO esto tal vez no deberia ser un mapa
		Map<Position, Combatant> positions = new HashMap<>();
		positions.put(Position.LEADER_POSITION, this.leaderSquare.getCombatant());

		for (Line line : this.lines.values()) {
			for (Square square : line.getSquares()) {
				positions.put(square.getPosition(), square.getCombatant());
			}
		}

		return positions;
	}
}
