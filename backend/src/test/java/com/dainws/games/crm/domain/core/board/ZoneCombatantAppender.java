package com.dainws.games.crm.domain.core.board;

import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;

public class ZoneCombatantAppender {

	private ZoneCombatantAppender() {}

	public static void addCombatantToNextFreeCoordinate(Zone zone, Combatant combatant) throws NotAllowedException {
		Coordinate coordinate = searchFreeCoordenate(zone);
		zone.putCombatant(coordinate, combatant);
	}

	public static void addCombatantToNextFreeCoordinateAt(Zone zone, int rowIndex, Combatant combatant) throws NotAllowedException {
		int columnIndex = searchFreeColumn(zone, rowIndex);

		Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
		zone.putCombatant(coordinate, combatant);
	}

	private static Coordinate searchFreeCoordenate(Zone zone) {
		int rowIndex = searchFreeRow(zone);
		int columnIndex = searchFreeColumn(zone, rowIndex);
		return new Coordinate(rowIndex, columnIndex);
	}
	
	private static int searchFreeRow(Zone zone) {
		int rowCount = zone.getCombatants().length;

		int rowIndex = 0;
		int selectedRowIndex = -1;
		while (rowIndex < rowCount && selectedRowIndex == -1) {
			if (!zone.isFilledAt(rowIndex)) {
				selectedRowIndex = rowIndex;
			}

			rowIndex++;
		}

		return selectedRowIndex;
	}
	
	private static int searchFreeColumn(Zone zone, int rowIndex) {
		int rowSize = zone.getCombatants()[rowIndex].length;

		int columnIndex = 0;
		int selectedColumnIndex = -1;
		while (columnIndex < rowSize && selectedColumnIndex == -1) {
			Coordinate coordinate = new Coordinate(rowIndex, columnIndex);

			if (!zone.hasCombatant(coordinate)) {
				selectedColumnIndex = columnIndex;
			}

			columnIndex++;
		}

		return selectedColumnIndex;
	}
}
