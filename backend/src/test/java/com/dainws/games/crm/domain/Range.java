package com.dainws.games.crm.domain;

import java.util.Objects;
import java.util.Random;

public class Range<T extends Comparable<T>> {
	private T start;
	private T end;
	
	private Range(T start, T end) {
		this.start = start;
		this.end = end;
	}
	
	public boolean isInRange(T value) {
		if (value == null) {
			return false;
		}

		return this.start.compareTo(value) <= 0 && value.compareTo(this.end) <= 0;
	}
	
	public boolean isOutOfRange(T value) {
		if (value == null) {
			return false;
		}

		return this.end.compareTo(value) < 0 && value.compareTo(this.start) < 0;
	}
	
	@Override
	public String toString() {
		return "[from=%s, to=%s]".formatted(this.start, this.end);
	}
	
	public static <T extends Number & Comparable<T>> T randomBetween(Range<T> range) {
		Objects.requireNonNull(range);
        return randomBetween(range.start, range.end);
	}
	
	@SuppressWarnings("unchecked")
	public static <T extends Number> T randomBetween(T start, T end) {
		Objects.requireNonNull(start);
		Objects.requireNonNull(end);

		double startDouble = start.doubleValue();
		double endDouble = end.doubleValue();
        double randomValue = startDouble + (endDouble - startDouble) * new Random().nextDouble();

        return (T) start.getClass().cast(randomValue);
	}
	
	public static <T extends Comparable<T>> Range<T> of(T start, T end) {
		Objects.requireNonNull(start);
		Objects.requireNonNull(end);

		if (start.compareTo(end) >= 0) {
			throw new IllegalArgumentException("start value has to be lower than end value");
		}

        return new Range<>(start, end);
    }
}
