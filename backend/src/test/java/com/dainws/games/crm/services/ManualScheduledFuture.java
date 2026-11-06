package com.dainws.games.crm.services;

import java.util.concurrent.Delayed;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class ManualScheduledFuture implements ScheduledFuture<Object> {

	private boolean isCancelled;

	@Override
	public long getDelay(TimeUnit unit) {
		return 0;
	}

	@Override
	public int compareTo(Delayed other) {
		return 0;
	}

	@Override
	public boolean cancel(boolean mayInterruptIfRunning) {
		this.isCancelled = true;
		return true;
	}

	@Override
	public boolean isCancelled() {
		return this.isCancelled;
	}

	@Override
	public boolean isDone() {
		return this.isCancelled;
	}

	@Override
	public Object get() {
		return null;
	}

	@Override
	public Object get(long timeout, TimeUnit unit) {
		return null;
	}
}
