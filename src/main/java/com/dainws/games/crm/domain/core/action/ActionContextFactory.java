package com.dainws.games.crm.domain.core.action;

public interface ActionContextFactory {
	ActionContext createContextFromTemplate(ActionContextTemplate contextTemplate);
}
