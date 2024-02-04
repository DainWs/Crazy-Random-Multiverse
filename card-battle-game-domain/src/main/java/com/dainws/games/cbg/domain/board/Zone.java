package com.dainws.games.cbg.domain.board;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.exception.CoordinateNotAllowedException;
import com.dainws.games.cbg.domain.exception.CoordinateOutOfBoundsException;
import com.dainws.games.cbg.domain.exception.EmptyCoordinateException;
import com.dainws.games.cbg.domain.exception.NotEmptyCoordinateException;

public abstract class Zone {
	private int horizontalDimension;
	private int verticalDimension;
	private Combatant[][] combatants;

	protected Zone(int horizontalDimension, int verticalDimension) {
		this.horizontalDimension = horizontalDimension;
		this.verticalDimension = verticalDimension;
		this.combatants = new Combatant[verticalDimension][horizontalDimension];
	}
	
	public abstract double getVitality();

	public boolean isAlive() {
		return this.getVitality() > 0;
	}

	public boolean hasCombatant(Coordinate coordinate) {
		if (this.isValidCoordinate(coordinate)) {
			int row = coordinate.getRow();
			int column = coordinate.getColumn();
			return this.combatants[row][column] != null;
		}

		return false;
	}

	public Combatant getCombatant(Coordinate coordinate) throws EmptyCoordinateException {
		if (this.hasCombatant(coordinate)) {
			int row = coordinate.getRow();
			int column = coordinate.getColumn();
			return this.combatants[row][column];
		}

		throw new EmptyCoordinateException();
	}

	public void putCombatant(Coordinate coordinate, Combatant combatant)
			throws CoordinateOutOfBoundsException, NotEmptyCoordinateException, CoordinateNotAllowedException {
		if (!this.isValidCoordinate(coordinate)) {
			throw new CoordinateOutOfBoundsException();
		}

		if (!this.canPutCombatantIn(coordinate)) {
			throw new CoordinateNotAllowedException("EXCEPTION_CANT_PUT_COMBATANT_IN_COORDINATE");
		}

		int row = coordinate.getRow();
		int column = coordinate.getColumn();
		this.combatants[row][column] = combatant;
	}

	public void removeCombatant(Coordinate coordinate) {
		if (!this.isValidCoordinate(coordinate)) {
			throw new CoordinateOutOfBoundsException();
		}

		int row = coordinate.getRow();
		int column = coordinate.getColumn();
		this.combatants[row][column] = null;
	}

	private boolean canPutCombatantIn(Coordinate coordinate) {
		if (this.hasCombatant(coordinate)) {
			return false;
		}

		int row = coordinate.getRow();
		int prevRow = row - 1;
		if (row > 0 && !this.isRowFull(prevRow)) {
			return false;
		}

		return true;
	}

	private boolean isRowFull(int row) {
		boolean isFull = true;

		for (Combatant combatant : this.combatants[row]) {
			if (combatant == null) {
				isFull = false;
			}
		}

		return isFull;
	}

	protected boolean isValidCoordinate(Coordinate coordinate) {
		int row = coordinate.getRow();
		int column = coordinate.getColumn();

		boolean isRowOutOfRange = (0 > row || row >= this.verticalDimension);
		if (isRowOutOfRange) {
			return false;
		}

		boolean isColumnOutOfRange = (0 > column || column >= this.horizontalDimension);
		return !isColumnOutOfRange;
	}

	public Combatant[][] getCombatants() {
		return this.combatants.clone();
	}
	
	public int getHorizontalDimension() {
		return this.horizontalDimension;
	}
	
	public int getVerticalDimension() {
		return this.verticalDimension;
	}
}
