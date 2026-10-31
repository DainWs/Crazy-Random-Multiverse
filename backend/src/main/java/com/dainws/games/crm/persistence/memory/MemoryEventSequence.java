package com.dainws.games.crm.persistence.memory;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import com.dainws.games.crm.domain.core.GameCode;

public class MemoryEventSequence {
	private Map<GameCode, AtomicInteger> sequences;

	public MemoryEventSequence() {
		this.sequences = new ConcurrentHashMap<>();
	}

	public int next(GameCode gameCode) {
		return this.sequences.computeIfAbsent(gameCode, code -> new AtomicInteger()).incrementAndGet();
	}
}
