package com.dainws.games.crm.domain.ai;

import java.util.UUID;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class AIPlayer extends Player {
	
	private Behavior behavior;

	public AIPlayer(Behavior behavior, String name) {
		this(behavior, name, UUID.randomUUID().toString());
	}
	
	public AIPlayer(Behavior behavior, String name, String uuid) {
		super(PlayerCode.from(uuid), "%s (AI)".formatted(name));
		this.behavior = behavior;
		this.behavior.setSelfAwareness(this);
	}
	
	public void performBehavior(Game game) {
		try {
			System.out.println("performing");
			System.out.println(this.getHand().getCards().size());
			this.behavior.performBehavior(game);
		} catch (Throwable e) {
			System.exit(0);
		}
	}
	
	@Override
	public boolean isSpectator() {
		return false;
	}
}
