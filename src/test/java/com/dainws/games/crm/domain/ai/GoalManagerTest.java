package com.dainws.games.crm.domain.ai;

public interface GoalManagerTest {
	void testGivenGoals_whenDefiningGoals_thenGoalsAreCorrectlyAdded();

	void testGivenUnachievedGoal_whenRemovingAchievedGoals_thenGoalRemainsActive();

	void testGivenNoGoals_whenGettingCurrentGoals_thenReturnsEmptyList();
}
