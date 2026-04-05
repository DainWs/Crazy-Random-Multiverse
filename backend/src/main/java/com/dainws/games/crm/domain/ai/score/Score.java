package com.dainws.games.crm.domain.ai.score;

import java.util.Objects;

public final class Score implements Comparable<Score> {
	private int value;

	public Score() {
		this.value = 0;
	}
	
	public int value() {
		return this.value;
	}
	
	public String text() {
		return String.valueOf(this.value);
	}
	
	public boolean isZero() {
		return this.value == 0;
	}

	public void set(int amount) {
		this.value = amount;
	}
	
	public void apply(Score score) {
		this.increase(score);
	}

	public void increase() {
		this.value++;
	}
	
	public void increase(int amount) {
		this.value += amount;
	}
	
	public void increase(Score amount) {
		this.increase(amount.value);
	}

	public void decrease() {
		this.value--;
	}
	
	public void decrease(int amount) {
		this.value -= amount;
	}
	
	public void decrease(Score amount) {
		this.decrease(amount.value);
	}

	public boolean isBiggerOrEqual(Score that) {
		return this.value >= that.value;
	}

	public boolean isLowerOrEqual(Score that) {
		return this.value <= that.value;
	}

	public boolean isBiggerThan(Score that) {
		return this.value > that.value;
	}

	public boolean isLowerThan(Score that) {
		return this.value < that.value;
	}

	@Override
	public int compareTo(Score that) {
		return this.value - that.value;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj != null && obj instanceof Score that) {
			return this.value == that.value;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.value);
	}

	@Override
	public String toString() {
		return this.text();
	}
	
	public static final Score of(int value) {
		Score score = new Score();
		score.set(value);
		return score;
	}
}
