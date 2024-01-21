package com.dainws.games.cbg.domain.action;

public interface ActionContextFactory {
	ActionContext createContextFromTemplate(ActionContextTemplate contextTemplate);
}
