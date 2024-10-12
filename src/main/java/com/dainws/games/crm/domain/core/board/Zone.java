package com.dainws.games.crm.domain.core.board;

import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.core.exception.CoordinateOutOfBoundsException;
import com.dainws.games.crm.domain.core.exception.OperationNotAllowedException;

public abstract class Zone {
	protected static final Combatant NONE = null;

	private Combatant[][] combatants;
	private int capacity;

	protected Zone(int horizontalDimension, int verticalDimension) {
		this.combatants = this.createCombatantsMatrix(horizontalDimension, verticalDimension);
		this.capacity = 0;
		
		for (int rowIndex = 0; rowIndex < this.combatants.length; rowIndex++) {
			this.capacity += this.combatants[rowIndex].length;
		}
	}

	protected Combatant[][] createCombatantsMatrix(int horizontalDimension, int verticalDimension) {
		return new Combatant[verticalDimension][horizontalDimension];
	}

	public abstract boolean isAlive();

	public abstract Health getZoneHealth();

	public boolean isFilled() {
		boolean hasCombatants = true;
		for (int rowIndex = 0; rowIndex < this.combatants.length; rowIndex++) {
			if (!this.isFilledAt(rowIndex)) {
				hasCombatants = false;
			}
		}

		return hasCombatants;
	}

	public boolean isFilledAt(int rowIndex) {
		if (!this.validate(rowIndex)) {
			return false;
		}

		boolean hasCombatants = true;
		for (int columnIndex = 0; columnIndex < this.combatants[rowIndex].length; columnIndex++) {
			if (this.combatants[rowIndex][columnIndex] == NONE) {
				hasCombatants = false;
			}
		}

		return hasCombatants;
	}

	public boolean hasCombatants() {
		boolean hasCombatants = false;
		for (int rowIndex = 0; rowIndex < this.combatants.length; rowIndex++) {
			if (this.hasCombatantsAt(rowIndex)) {
				hasCombatants = true;
			}
		}

		return hasCombatants;
	}

	public boolean hasCombatantsAt(int rowIndex) {
		if (!this.validate(rowIndex)) {
			return false;
		}

		boolean hasCombatants = false;
		for (int columnIndex = 0; columnIndex < this.combatants[rowIndex].length; columnIndex++) {
			if (this.combatants[rowIndex][columnIndex] != NONE) {
				hasCombatants = true;
			}
		}

		return hasCombatants;
	}

	public boolean hasCombatant(Coordinate coordinate) {
		return this.hasCombatant(coordinate.getRow(), coordinate.getColumn());
	}

	private boolean hasCombatant(int rowIndex, int columnIndex) {
		if (!this.validate(rowIndex, columnIndex)) {
			return false;
		}

		return this.combatants[rowIndex][columnIndex] != NONE;
	}

	public Combatant[][] getCombatants() {
		return this.combatants.clone();
	}

	public Combatant[] getCombatantAt(int rowIndex) {
		if (!this.validate(rowIndex)) {
			throw new CoordinateOutOfBoundsException();
		}

		return this.combatants[rowIndex].clone();
	}

	public Combatant getCombatant(Coordinate coordinate) {
		if (!this.validate(coordinate)) {
			throw new CoordinateOutOfBoundsException();
		}

		int row = coordinate.getRow();
		int column = coordinate.getColumn();
		return this.combatants[row][column];
	}

	public void addCombatant(Combatant combatant)  {
		int rowIndex = 0;
		int selectedRowIndex = -1;
		while (rowIndex < this.combatants.length && selectedRowIndex == -1) {
			if (!this.isFilledAt(rowIndex)) {
				selectedRowIndex = rowIndex;
			}

			rowIndex++;
		}

		if (selectedRowIndex == -1) {
			throw new OperationNotAllowedException("zone.already_filled");
		}

		this.addCombatantAt(rowIndex, combatant);
	}

	public void addCombatantAt(int rowIndex, Combatant combatant) {
		if (!this.validate(rowIndex)) {
			throw new CoordinateOutOfBoundsException();
		}

		if (!this.validatePrevRow(rowIndex)) {
			throw new OperationNotAllowedException("zone.row.previous_need_to_be_filled");
		}

		int columnIndex = 0;
		int selectedColumnIndex = -1;
		while (columnIndex < this.combatants[rowIndex].length && selectedColumnIndex == -1) {
			if (!this.hasCombatant(rowIndex, columnIndex)) {
				selectedColumnIndex = columnIndex;
			}

			columnIndex++;
		}

		if (selectedColumnIndex == -1) {
			throw new OperationNotAllowedException("zone.row.already_filled");
		}

		this.combatants[rowIndex][columnIndex] = combatant;
	}

	public void putCombatant(Coordinate coordinate, Combatant combatant)
			throws CoordinateOutOfBoundsException, OperationNotAllowedException {
		if (!this.validate(coordinate)) {
			throw new CoordinateOutOfBoundsException();
		}

		if (this.hasCombatant(coordinate)) {
			throw new OperationNotAllowedException("zone.coordinate.already_filled");
		}

		if (!this.validatePrevRow(coordinate.getRow())) {
			throw new OperationNotAllowedException("zone.row.already_filled");
		}

		this.combatants[coordinate.getRow()][coordinate.getColumn()] = combatant;
	}

	private boolean validatePrevRow(int currentRow) {
		if (currentRow == 0) {
			return true;
		}

		int prevRowIndex = currentRow - 1;
		return (!this.isFilledAt(prevRowIndex));
	}
	
	public void removeAllCombatants() {
		for (int rowIndex = 0; rowIndex < this.combatants.length; rowIndex++) {
			this.removeCombatantsAt(rowIndex);
		}
	}
	
	public void removeCombatantsAt(int rowIndex) {
		if (!this.validate(rowIndex)) {
			throw new CoordinateOutOfBoundsException();
		}
		
		for (int columnIndex = 0; columnIndex < this.combatants[rowIndex].length; columnIndex++) {
			this.combatants[rowIndex][columnIndex] = NONE;
		}
	}

	public void removeCombatant(Coordinate coordinate) {
		if (!this.validate(coordinate)) {
			throw new CoordinateOutOfBoundsException();
		}

		int row = coordinate.getRow();
		int column = coordinate.getColumn();
		this.combatants[row][column] = NONE;
	}

	public int countCombatants() {
		int count = 0;
		for (int rowIndex = 0; rowIndex < this.combatants.length; rowIndex++) {
			count += this.countCombatantsAt(rowIndex);
		}

		return count;
	}

	public int countCombatantsAt(int rowIndex) {
		if (!this.validate(rowIndex)) {
			return 0;
		}

		int count = 0;
		for (Combatant combatant : this.combatants[rowIndex]) {
			if (combatant != NONE) {
				count++;
			}
		}

		return count;
	}

	protected boolean validate(Coordinate coordinate) {
		return this.validate(coordinate.getRow(), coordinate.getColumn());
	}

	protected boolean validate(int rowIndex, int columnIndex) {
		if (!this.validate(rowIndex)) {
			return false;
		}

		return (0 <= columnIndex && columnIndex < this.combatants[rowIndex].length);
	}

	protected boolean validate(int rowIndex) {
		return (0 <= rowIndex && rowIndex < this.combatants.length);
	}

	public int getCapacity() {
		return this.capacity;
	}
	
	public int getHorizontalDimension(int rowIndex) {
		if (!this.validate(rowIndex)) {
			return 0;
		}

		return this.combatants[rowIndex].length;
	}

	public int getVerticalDimension() {
		return this.combatants.length;
	}
}
