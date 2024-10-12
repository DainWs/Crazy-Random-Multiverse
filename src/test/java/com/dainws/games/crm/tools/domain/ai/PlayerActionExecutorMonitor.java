package com.dainws.games.crm.tools.domain.ai;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.player.PlayerActionExecutor;
import com.dainws.games.crm.tools.domain.core.event.EventPublisherMonitor;
import com.dainws.games.crm.tools.domain.error.ErrorHandlerMonitor;

public class PlayerActionExecutorMonitor extends PlayerActionExecutor {

	private Map<Action, ActionContext> executedActions;
	private ErrorHandlerMonitor errorHandlerMonitor;
	private EventPublisherMonitor eventPublisherMonitor;

	public PlayerActionExecutorMonitor() {
		super();
		this.executedActions = new HashMap<>();
		this.errorHandlerMonitor = new ErrorHandlerMonitor();
		this.eventPublisherMonitor = new EventPublisherMonitor();

		this.setExceptionHandler(this.errorHandlerMonitor);
		this.setEventPublisher(this.eventPublisherMonitor);
	}

	@Override
	public boolean execute(Action action, ActionContext actionContext) {
		this.executedActions.put(action, actionContext);
		return super.execute(action, actionContext);
	}

	public boolean wasActionExecuted(Class<? extends Action> actionType) {
		Objects.requireNonNull(actionType);
		return this.anyExecutedActionMatch(action -> action.getClass().equals(actionType));
	}

	public boolean wasActionNotExecuted(Class<? extends Action> actionType) {
		Objects.requireNonNull(actionType);
		return this.noneExecutedActionMatch(action -> action.getClass().equals(actionType));
	}

	public boolean noneExecutedActionMatch(Predicate<Action> predicate) {
		Objects.requireNonNull(predicate);
		return this.executedActions.keySet().stream().noneMatch(predicate);
	}

	public boolean anyExecutedActionMatch(Predicate<Action> predicate) {
		Objects.requireNonNull(predicate);
		return this.executedActions.keySet().stream().anyMatch(predicate);
	}

	public boolean allExecutedActionMatch(Predicate<Action> predicate) {
		Objects.requireNonNull(predicate);
		return this.executedActions.keySet().stream().allMatch(predicate);
	}
	
	public ActionContext getExecutedActionContext(Action action) {
		return this.executedActions.get(action);
	}

	public List<Action> getExecutedActions() {
		return new ArrayList<>(this.executedActions.keySet());
	}
	
	public List<ActionContext> getExecutedActionContexts() {
		return new ArrayList<>(this.executedActions.values());
	}

	public int countExecutedActions() {
		return this.executedActions.size();
	}

	public EventPublisherMonitor getEventPublisherMonitor() {
		return this.eventPublisherMonitor;
	}

	public ErrorHandlerMonitor getErrorHandlerMonitor() {
		return this.errorHandlerMonitor;
	}
}
