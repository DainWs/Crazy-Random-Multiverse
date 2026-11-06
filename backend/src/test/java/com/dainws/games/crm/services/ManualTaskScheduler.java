package com.dainws.games.crm.services;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ScheduledFuture;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.Trigger;

public class ManualTaskScheduler implements TaskScheduler {

	private Runnable task;
	private Instant scheduledTime;
	private ManualScheduledFuture future;

	@Override
	public ScheduledFuture<?> schedule(Runnable task, Instant startTime) {
		this.task = task;
		this.scheduledTime = startTime;
		this.future = new ManualScheduledFuture();
		return this.future;
	}

	public void runScheduledTask() {
		this.task.run();
	}

	public boolean hasScheduledTask() {
		return this.task != null;
	}

	public Instant getScheduledTime() {
		return this.scheduledTime;
	}

	public ManualScheduledFuture getFuture() {
		return this.future;
	}

	@Override
	public ScheduledFuture<?> schedule(Runnable task, Trigger trigger) {
		throw new UnsupportedOperationException();
	}

	@Override
	public ScheduledFuture<?> scheduleAtFixedRate(Runnable task, Instant startTime, Duration period) {
		throw new UnsupportedOperationException();
	}

	@Override
	public ScheduledFuture<?> scheduleAtFixedRate(Runnable task, Duration period) {
		throw new UnsupportedOperationException();
	}

	@Override
	public ScheduledFuture<?> scheduleWithFixedDelay(Runnable task, Instant startTime, Duration delay) {
		throw new UnsupportedOperationException();
	}

	@Override
	public ScheduledFuture<?> scheduleWithFixedDelay(Runnable task, Duration delay) {
		throw new UnsupportedOperationException();
	}
}
