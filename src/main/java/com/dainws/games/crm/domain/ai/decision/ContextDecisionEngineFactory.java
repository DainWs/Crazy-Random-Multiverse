package com.dainws.games.crm.domain.ai.decision;

import java.util.HashMap;
import java.util.Map;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.PutAction;

public class ContextDecisionEngineFactory {
	
	private Map<Class<? extends Action>, ContextDecisionEngine> contextEngines;
	
	public ContextDecisionEngineFactory() {
		this.contextEngines = new HashMap<>();
		this.contextEngines.put(AttackAction.class, new AttackDecisionEngine());
		this.contextEngines.put(PutAction.class, new PutDecisionEngine());
	}
	
	public ContextDecisionEngine createContextDecisionEngine(AIActionTemplate actionTemplate) {
		if (this.contextEngines.containsKey(actionTemplate.getActionType())) {
			return this.contextEngines.get(actionTemplate.getActionType());
		}
		
		return new NoneDecisionEngine();
	}
}
