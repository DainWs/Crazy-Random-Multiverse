package com.dainws.games.crm.controller.events;

import java.util.concurrent.Executor;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.PayloadApplicationEvent;
import org.springframework.context.event.SimpleApplicationEventMulticaster;
import org.springframework.core.ResolvableType;

import com.dainws.games.crm.domain.core.event.Event;

/** Delivers the game events in the publishing thread and the rest, such as sending to the clients, to the executor. */
public class GameEventMulticaster extends SimpleApplicationEventMulticaster {

	public GameEventMulticaster(Executor taskExecutor) {
		this.setTaskExecutor(taskExecutor);
	}

	@Override
	public void multicastEvent(ApplicationEvent event, ResolvableType eventType) {
		if (this.isGameEvent(event)) {
			ResolvableType type = eventType;
			if (type == null) {
				type = ResolvableType.forInstance(event);
			}

			this.multicastInPublishingThread(event, type);
		} else {
			super.multicastEvent(event, eventType);
		}
	}

	private boolean isGameEvent(ApplicationEvent event) {
		return event instanceof PayloadApplicationEvent<?> payloadEvent && payloadEvent.getPayload() instanceof Event;
	}

	private void multicastInPublishingThread(ApplicationEvent event, ResolvableType type) {
		this.getApplicationListeners(event, type).forEach(listener -> this.invokeListener(listener, event));
	}
}
