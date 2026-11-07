package com.dainws.games.crm.controller.events;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;

class GameEventMulticasterTest {

	AnnotationConfigApplicationContext context;
	ExecutorService executor;
	ThreadRecordingListener listener;
	Event event;

	@BeforeEach
	void beforeEach() {
		Game game = new GameBuilder().withNRandomPlayers(1).build();
		this.event = new Event(EventCode.PLAYER_PASS_TURN, game);
		this.executor = Executors.newSingleThreadExecutor();
		this.listener = new ThreadRecordingListener();
		this.context = new AnnotationConfigApplicationContext();
		this.context.registerBean("applicationEventMulticaster",
				GameEventMulticaster.class, () -> new GameEventMulticaster(this.executor));
		this.context.registerBean(ThreadRecordingListener.class, () -> this.listener);
		this.context.refresh();
	}

	@AfterEach
	void afterEach() {
		this.context.close();
		this.executor.shutdownNow();
	}

	// CON-22
	@Test
	void testGivenGameEvent_whenPublish_thenListenersReactInThePublishingThread() {
		Thread thread = Thread.currentThread();

		this.context.publishEvent(this.event);

		assertEquals(List.of(thread), this.listener.getGameEventThreads());
	}

	@Test
	@Timeout(10)
	void testGivenMappedEvent_whenPublish_thenItIsSentOutsideThePublishingThread() throws Exception {
		Thread thread = Thread.currentThread();

		this.context.publishEvent(new MappedEvent(this.event, Map.of()));
		this.listener.awaitMappedEvent();

		assertNotEquals(thread, this.listener.getMappedEventThreads().get(0));
	}
}
