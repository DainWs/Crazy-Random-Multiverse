package com.dainws.games.crm.domain.ai;

public interface DecisionEngineTest {

	void testGivenGoalsAndActions_whenDecideBestAction_thenReturnBestAction();

	void testGivenGoalsAndNoneActionStatisfyGoals_whenDecideBestAction_thenReturnNone();

	void testGivenGoalsAndActionStatisfyGoals_whenDecideBestAction_thenReturnBestAction();

	void testGivenGoalsAndNoneActions_whenDecideBestAction_thenReturnNone();

}
