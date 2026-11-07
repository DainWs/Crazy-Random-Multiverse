package com.dainws.games.crm.usecase;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;

/** Observes the lock of the game and the pass turns running at once. */
public class LockObservingFacade extends PlayerActionFacade {
	private final Game game;
	private final List<Boolean> lockedWhilePerforming;
	private final AtomicInteger performing;
	private final AtomicInteger mostPerformingAtOnce;

	public LockObservingFacade(Game game) {
		super(null);
		this.game = game;
		this.lockedWhilePerforming = new CopyOnWriteArrayList<>();
		this.performing = new AtomicInteger();
		this.mostPerformingAtOnce = new AtomicInteger();
	}

	@Override
	public ActionResult playerPassTurn(ActionContextTemplate contextTemplate) {
		int performingNow = this.performing.incrementAndGet();
		this.mostPerformingAtOnce.accumulateAndGet(performingNow, Math::max);
		this.lockedWhilePerforming.add(Thread.holdsLock(this.game));

		Thread.yield();
		this.performing.decrementAndGet();
		return ActionResult.successful();
	}

	public List<Boolean> getLockedWhilePerforming() {
		return List.copyOf(this.lockedWhilePerforming);
	}

	public int getMostPerformingAtOnce() {
		return this.mostPerformingAtOnce.get();
	}
}
