package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.exception.GameException;

public interface ActionTest {

	void testGivenContext_whenPerform_thenActionIsPerformed() throws GameException;
}
