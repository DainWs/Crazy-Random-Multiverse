package com.dainws.games.crm.controller.events;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.springframework.context.event.EventListener;

import com.dainws.games.crm.domain.core.event.Event;

/** Remembers the thread in which it received each kind of event. */
public class ThreadRecordingListener {
	private static final int TIMEOUT_SECONDS = 5;

	private final List<Thread> gameEventThreads;
	private final List<Thread> mappedEventThreads;
	private final CountDownLatch mappedEventReceived;

	public ThreadRecordingListener() {
		this.gameEventThreads = new CopyOnWriteArrayList<>();
		this.mappedEventThreads = new CopyOnWriteArrayList<>();
		this.mappedEventReceived = new CountDownLatch(1);
	}

	@EventListener
	void onGameEvent(Event event) {
		this.gameEventThreads.add(Thread.currentThread());
	}

	@EventListener
	void onMappedEvent(MappedEvent event) {
		this.mappedEventThreads.add(Thread.currentThread());
		this.mappedEventReceived.countDown();
	}

	public void awaitMappedEvent() throws InterruptedException {
		boolean isReceived = this.mappedEventReceived.await(TIMEOUT_SECONDS, TimeUnit.SECONDS);
		if (!isReceived) {
			throw new IllegalStateException("No mapped event was received");
		}
	}

	public List<Thread> getGameEventThreads() {
		return List.copyOf(this.gameEventThreads);
	}

	public List<Thread> getMappedEventThreads() {
		return List.copyOf(this.mappedEventThreads);
	}
}
