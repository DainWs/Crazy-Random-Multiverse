package com.dainws.games.crm.usecase;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.player.PlayerActionFacade;
import com.dainws.games.crm.usecase.dto.ActionType;

public class RecordingPlayerActionFacade extends PlayerActionFacade {
	private List<ActionType> performedActions;

	public RecordingPlayerActionFacade() {
		super(null);
		this.performedActions = new ArrayList<>();
	}

	@Override
	public ActionResult playerEquipCard(ActionContextTemplate contextTemplate) {
		this.performedActions.add(ActionType.EQUIP_ACTION);
		return ActionResult.successful();
	}

	@Override
	public ActionResult playerSurrender(ActionContextTemplate contextTemplate) {
		this.performedActions.add(ActionType.SURRENDER_ACTION);
		return ActionResult.successful();
	}

	@Override
	public ActionResult playerPassTurn(ActionContextTemplate contextTemplate) {
		this.performedActions.add(ActionType.PASS_TURN);
		return ActionResult.successful();
	}

	public List<ActionType> getPerformedActions() {
		return List.copyOf(this.performedActions);
	}
}
