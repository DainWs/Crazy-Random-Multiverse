package com.dainws.games.crm.usecase;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.usecase.dto.ActionType;

public class RecordingPlayerActionFacade extends PlayerActionFacade {
	private List<ActionType> performedActions;

	public RecordingPlayerActionFacade() {
		super(null);
		this.performedActions = new ArrayList<>();
	}

	@Override
	public boolean playerEquipCard(ActionContextTemplate contextTemplate) {
		return this.performedActions.add(ActionType.EQUIP_ACTION);
	}

	@Override
	public boolean playerSurrender(ActionContextTemplate contextTemplate) {
		return this.performedActions.add(ActionType.SURRENDER_ACTION);
	}

	@Override
	public boolean playerPassTurn(ActionContextTemplate contextTemplate) {
		return this.performedActions.add(ActionType.PASS_TURN);
	}

	public List<ActionType> getPerformedActions() {
		return List.copyOf(this.performedActions);
	}
}
