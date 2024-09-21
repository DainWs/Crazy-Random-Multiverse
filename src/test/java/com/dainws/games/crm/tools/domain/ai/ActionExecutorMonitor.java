package com.dainws.games.crm.tools.domain.ai;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.ActionExecutor;
import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.tools.domain.core.event.EventPublisherMonitor;
import com.dainws.games.crm.tools.domain.error.ErrorHandlerMonitor;

public class ActionExecutorMonitor extends ActionExecutor {

	private List<AIAction> executedActions;
	private ErrorHandlerMonitor errorHandlerMonitor;
	private EventPublisherMonitor eventPublisherMonitor;

	public ActionExecutorMonitor() {
		super();
		this.executedActions = new ArrayList<>();
		this.errorHandlerMonitor = new ErrorHandlerMonitor();
		this.eventPublisherMonitor = new EventPublisherMonitor();
		
		this.setErrorHandler(this.errorHandlerMonitor);
		this.setEventPublisher(this.eventPublisherMonitor);
	}
	
	@Override
	public void execute(AIAction aiAction) {
		this.executedActions.add(aiAction);
		super.execute(aiAction);
	}

	public boolean wasActionExecuted(Class<? extends Action> actionType) {
		Objects.requireNonNull(actionType);
		return this.anyExecutedActionMatch(aiAction -> aiAction.getAction().getClass().equals(actionType));
	}
	
	public boolean wasActionNotExecuted(Class<? extends Action> actionType) {
		Objects.requireNonNull(actionType);
		return this.noneExecutedActionMatch(aiAction -> aiAction.getAction().getClass().equals(actionType));
	}
	
	public boolean noneExecutedActionMatch(Predicate<AIAction> predicate) {
		Objects.requireNonNull(predicate);
		return this.executedActions.stream()
				.noneMatch(predicate);
	}
	
	public boolean anyExecutedActionMatch(Predicate<AIAction> predicate) {
		Objects.requireNonNull(predicate);
		return this.executedActions.stream()
				.anyMatch(predicate);
	}
	
	public boolean allExecutedActionMatch(Predicate<AIAction> predicate) {
		Objects.requireNonNull(predicate);
		return this.executedActions.stream()
				.allMatch(predicate);
	}
	
	public List<AIAction> getExecutedActions() {
		return this.executedActions;
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
