package com.dainws.games.crm.console.controllers.dto;

public class CardDto {

	private String name;
	private String description;
	private String cardType;

	public int getCardWidth() {
		int maxLength = 0;
		if (this.name.length() > maxLength) {
			maxLength = this.name.length();
		}
		
		if (this.cardType.length() > maxLength) {
			maxLength = this.cardType.length();
		}

		if (this.description.length() > maxLength) {
			maxLength = this.description.length();
		}

		return maxLength;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getCardType() {
		return cardType;
	}
	
	public String toString(String cardBorder) {
		int cardWith = this.getCardWidth();
		int sides = 2;
		String dataWildcard = cardBorder+" %-"+cardWith+"s "+cardBorder;
		String horizontalBorder = cardBorder.repeat(cardWith + sides + cardBorder.length() * sides);
		String empty = dataWildcard.formatted(" ");

		return new StringBuilder()
			.append(horizontalBorder).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.name)).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.getCardType())).append("\n")
			.append(empty).append("\n")
			.append(dataWildcard.formatted(this.description)).append("\n")
			.append(empty).append("\n")
			.append(empty).append("\n")
			.append(empty).append("\n")
			.append(empty).append("\n")
			.append(empty).append("\n")
			.append(horizontalBorder).append("\n")
			.toString();
	}
}
