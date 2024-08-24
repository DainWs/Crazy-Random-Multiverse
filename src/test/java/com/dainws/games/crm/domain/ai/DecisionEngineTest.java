package com.dainws.games.crm.domain.ai;

public interface DecisionEngineTest {

	void testGivenGoalsAndActions_whenDecideBestAction_thenReturnOneOfTheBestActions();

	void testGivenGoalsAndNoneActionStatisfyGoals_whenDecideBestAction_thenReturnNull();

	void testGivenGoalsAndNoneActions_whenDecideBestAction_thenReturnNull();
}
