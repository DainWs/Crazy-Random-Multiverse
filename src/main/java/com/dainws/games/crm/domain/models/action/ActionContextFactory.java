package com.dainws.games.crm.domain.models.action;

public interface ActionContextFactory {
	ActionContext createContextFromTemplate(ActionContextTemplate contextTemplate);
}
