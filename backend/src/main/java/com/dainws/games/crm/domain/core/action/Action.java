package com.dainws.games.crm.domain.core.action;

public interface Action {
	ActionResult perform(ActionContext context);
}
