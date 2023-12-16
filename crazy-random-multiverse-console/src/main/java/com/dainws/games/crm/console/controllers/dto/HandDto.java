package com.dainws.games.crm.console.controllers.dto;

import java.util.List;

public class HandDto {

	private List<CombatantDto> leaders;
	private List<WarriorDto> warriors;
	private List<EquipmentDto> equipments;
	private List<CardDto> spells;
	
	public void setLeaders(List<CombatantDto> leaders) {
		this.leaders = leaders;
	}
	
	public void setWarriors(List<WarriorDto> warriors) {
		this.warriors = warriors;
	}
	
	public void setEquipments(List<EquipmentDto> equipments) {
		this.equipments = equipments;
	}
	
	public void setSpells(List<CardDto> spells) {
		this.spells = spells;
	}
	
	private int getCellWidth() {
		int maxCardWidth = 0;

		for (CombatantDto leaderDto : this.leaders) {
			int cardWidth = leaderDto.getCardWidth();
			if (cardWidth > maxCardWidth) {
				maxCardWidth = cardWidth;
			}
		}
		
		for (WarriorDto warriorDto : this.warriors) {
			int cardWidth = warriorDto.getCardWidth();
			if (cardWidth > maxCardWidth) {
				maxCardWidth = cardWidth;
			}
		}

		for (EquipmentDto equipmentDto : this.equipments) {
			int cardWidth = equipmentDto.getCardWidth();
			if (cardWidth > maxCardWidth) {
				maxCardWidth = cardWidth;
			}
		}
		
		for (CardDto spellDto : this.spells) {
			int cardWidth = spellDto.getCardWidth();
			if (cardWidth > maxCardWidth) {
				maxCardWidth = cardWidth;
			}
		}
		
		return maxCardWidth;
	}
	
	public String toString() {
		int cellWidth = this.getCellWidth();
		int cellCount = 2;
		String cellDelimiter = "#";
		String rowDelimiter = " ".repeat(cellWidth + (cellDelimiter.length() * cellCount)) + "\n"; 
		
		StringBuilder builder = new StringBuilder()
			.append(rowDelimiter)
			.append(" Hand \n")
			.append(rowDelimiter);
		
		for (CombatantDto leaderDto : this.leaders) {
			builder.append(leaderDto.toString())
				.append("\n\n");
		}

		for (WarriorDto warriorDto : this.warriors) {
			builder.append(warriorDto.toString())
				.append("\n\n");
		}
		
		for (EquipmentDto equipmentDto : this.equipments) {
			builder.append(equipmentDto.toString())
				.append("\n\n");
		}
		
		for (CardDto spellDto : this.spells) {
			builder.append(spellDto.toString())
				.append("\n\n");
		}
		return builder.toString();
	}
}
