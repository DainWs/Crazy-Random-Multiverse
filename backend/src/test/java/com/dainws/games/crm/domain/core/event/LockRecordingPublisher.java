package com.dainws.games.crm.domain.core.event;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.Game;

/** Remembers whether the publishing thread held the lock of the game. */
public class LockRecordingPublisher implements EventPublisher {
	private final EventCode watchedCode;
	private final List<Boolean> lockedWhenPublished;
	private Game game;

	public LockRecordingPublisher(EventCode watchedCode) {
		this.watchedCode = watchedCode;
		this.lockedWhenPublished = new ArrayList<>();
	}

	@Override
	public void publish(EventCode code) {
		this.record(code);
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.record(code);
	}

	@Override
	public void publish(Event event) {
		this.record(event.getCode());
	}

	private void record(EventCode code) {
		if (code == this.watchedCode) {
			this.lockedWhenPublished.add(Thread.holdsLock(this.game));
		}
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public List<Boolean> getLockedWhenPublished() {
		return List.copyOf(this.lockedWhenPublished);
	}
}
