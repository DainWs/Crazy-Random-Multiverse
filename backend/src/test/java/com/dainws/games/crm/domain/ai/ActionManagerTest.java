package com.dainws.games.crm.domain.ai;

public interface ActionManagerTest {

	void testGivenListOfPlayers_whenDefiningActions_thenCorrectNumberOfActionsIsCreated();
	
	void testGivenListOfPlayers_whenValidatingAction_thenReturnsTrueForValidAction();
	
	void testGivenInvalidAction_whenValidatingAction_thenReturnsFalse();

	void testGivenNoneActionsPerformed_whenCanPerformMoreActions_thenReturnsTrue();

	void testGivenSomeActionsPerformed_whenCanPerformMoreActions_thenReturnsTrue();

	void testGivenAllActionsPerformed_whenCanPerformMoreActions_thenReturnsFalse();
}
