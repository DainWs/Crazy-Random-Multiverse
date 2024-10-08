package com.dainws.games.crm.domain.core.card.statistics;

public abstract class Statistic {
	protected double value;
	
	protected Statistic(double value) {
		this.value = value;
	}
	
	public double getValue() {
		return this.value;
	}
}
