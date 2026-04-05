package com.dainws.games.crm.domain.ai.goals;

import java.util.Objects;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.ai.AIAction;

@FunctionalInterface
public interface GoalArchiveCondition extends Predicate<AIAction> {

	@Override
	boolean test(AIAction aiAction);

	@Override
	default GoalArchiveCondition and(Predicate<? super AIAction> other) {
		Objects.requireNonNull(other);
		return (aiAction) -> test(aiAction) && other.test(aiAction);
	}

	@Override
	default GoalArchiveCondition or(Predicate<? super AIAction> other) {
		Objects.requireNonNull(other);
		return (aiAction) -> test(aiAction) || other.test(aiAction);
	}

	@Override
	default GoalArchiveCondition negate() {
		return (aiAction) -> !test(aiAction);
	}
}
