package com.dainws.games.cbg.domain.dealer;

public interface DealStrategyFactory {
	DealStrategy createStrategy(int round);
}
