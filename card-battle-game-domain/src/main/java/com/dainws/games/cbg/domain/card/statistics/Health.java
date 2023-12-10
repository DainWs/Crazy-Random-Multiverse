package com.dainws.games.cbg.domain.card.statistics;

public class Health extends Statistic {

	private static final double INFINITE_HEALTH = Double.POSITIVE_INFINITY;

	public static final Health INFINITE = new Health(INFINITE_HEALTH);

	private double maxValue;

	private Health(double baseValue) {
		super(baseValue);
		this.maxValue = baseValue;
	}

	private Health(double baseValue, double maxValue) {
		super(baseValue);
		this.maxValue = maxValue;

		if (this.value > this.maxValue) {
			this.value = this.maxValue;
		}
	}

	public boolean isInfinite() {
		return this.value == INFINITE_HEALTH;
	}

	public boolean isZero() {
		return this.value <= 0;
	}

	public Health getRemainingHealthAgainst(Damage damage) {
		if (damage.isInfinite()) {
			return new Health(0, this.maxValue);
		}

		if (this.isInfinite()) {
			return this;
		}

		double remainingHealth = this.value - damage.getValue();
		if (remainingHealth < 0) {
			remainingHealth = 0;
		}

		return new Health(remainingHealth, this.maxValue);
	}

	public double getMaxValue() {
		return maxValue;
	}

	@Override
	public String toString() {
		if (this.equals(INFINITE)) {
			return "INFINITE";
		}

		return "%s/%s".formatted(this.value, this.maxValue);
	}

	public static Health newInstance(double baseValue) {
		return newInstance(baseValue, baseValue);
	}

	public static Health newInstance(double baseValue, double maxValue) {
		double validBaseValue = baseValue;
		double validMaxValue = maxValue;

		if (baseValue < 0) {
			validBaseValue = 0;
		}

		if (maxValue < validBaseValue) {
			validMaxValue = validBaseValue;
		}

		return new Health(validBaseValue, validMaxValue);
	}
}
