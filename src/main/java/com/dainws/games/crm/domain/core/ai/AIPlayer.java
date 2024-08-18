package com.dainws.games.crm.domain.core.ai;

import java.util.UUID;

import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class AIPlayer extends Player {
	
	private AIBehavior behavior;

	public AIPlayer(AIBehavior behavior, String name) {
		this(behavior, name, UUID.randomUUID().toString());
	}
	
	public AIPlayer(AIBehavior behavior, String name, String uuid) {
		super(PlayerCode.from(uuid), "%s (AI)".formatted(name));
		this.behavior = AIBehavior.NONE;
	}
	
	public void performBehavior() {
		this.behavior.performBehavior();
	}
	
	@Override
	public boolean isSpectator() {
		return false;
	}
}
