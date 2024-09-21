package com.dainws.games.crm.domain.core.board;

import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.exception.CoordinateNotAllowedException;
import com.dainws.games.crm.domain.exception.CoordinateOutOfBoundsException;
import com.dainws.games.crm.domain.exception.EmptyCoordinateException;
import com.dainws.games.crm.domain.exception.NotEmptyCoordinateException;

public abstract class Zone {
	private int horizontalDimension;
	private int verticalDimension;
	private Combatant[][] combatants;

	protected Zone(int horizontalDimension, int verticalDimension) {
		this.horizontalDimension = horizontalDimension;
		this.verticalDimension = verticalDimension;
		this.combatants = new Combatant[verticalDimension][horizontalDimension];
	}

	public abstract boolean isAlive();
	
	public abstract Health getZoneHealth();

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
		if (row > 0 && !this.isLineFilled(prevRow)) {
			return false;
		}

		return true;
	}
	
	public boolean isEmpty() {
		boolean isEmpty = true;
		
		for (int i = 0; i < this.verticalDimension; i++) {
			if (!this.isLineEmpty(i)) {
				isEmpty = false;
			}
		}
		
		return isEmpty;
	}

	public boolean isLineEmpty(int verticalIndex) {
		boolean isEmpty = true;

		for (Combatant combatant : this.combatants[verticalIndex]) {
			if (combatant != null) {
				isEmpty = false;
			}
		}

		return isEmpty;
	}
	
	public boolean isFilled() {
		boolean isFilled = true;
		
		for (int i = 0; i < this.verticalDimension; i++) {
			if (!this.isLineFilled(i)) {
				isFilled = false;
			}
		}
		
		return isFilled;
	}
	
	public boolean isLineFilled(int verticalIndex) {
		boolean isFull = true;

		for (Combatant combatant : this.combatants[verticalIndex]) {
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
	
	public int countCombatants() {
		int count = 0;
		
		for (int i = 0; i < this.verticalDimension; i++) {
			count += this.countCombatantsInLine(i);
		}
		
		return count;
	}
	
	public int countCombatantsInLine(int verticalIndex) {
		int count = 0;

		for (Combatant combatant : this.combatants[verticalIndex]) {
			if (combatant != null) count++;
		}

		return count;
	}
	
	public int getCapacity() {
		return this.horizontalDimension * this.verticalDimension;
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
