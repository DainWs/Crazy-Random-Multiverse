package com.dainws.games.crm.domain.ai.classic;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.ActionManager;
import com.dainws.games.crm.domain.ai.action.AttackPlayerActionTemplate;
import com.dainws.games.crm.domain.ai.action.PutCardActionTemplate;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class ClassicActionManager implements ActionManager {

	private PlayerCode myPlayerCode;
	private List<AIActionTemplate> aiActionTemplates;
	
	@Override
	public void applySelfAwareness(AIPlayer meAsAPlayer) {
		this.myPlayerCode = meAsAPlayer.getPlayerCode();
	}

	@Override
	public void defineActions(Game game) {
		this.aiActionTemplates = new ArrayList<>();
		this.aiActionTemplates.add(new PutCardActionTemplate());
		this.aiActionTemplates.add(new AttackPlayerActionTemplate());
	}

	@Override
	public List<AIActionTemplate> getAvailableActions() {
		return this.aiActionTemplates;
	}
}
