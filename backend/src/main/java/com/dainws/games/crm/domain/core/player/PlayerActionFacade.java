package com.dainws.games.crm.domain.core.player;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.EquipAction;
import com.dainws.games.crm.domain.core.action.MoveAction;
import com.dainws.games.crm.domain.core.action.PassTurnAction;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.action.SurrenderAction;

public class PlayerActionFacade {
	private ActionContextFactory contextFactory;

	public PlayerActionFacade(ActionContextFactory actionContextFactory) {
		this.contextFactory = actionContextFactory;
	}

	public boolean playerPutCard(ActionContextTemplate contextTemplate) {
		return this.execute(new PutAction(), contextTemplate);
	}

	public boolean playerMoveCard(ActionContextTemplate contextTemplate) {
		return this.execute(new MoveAction(), contextTemplate);
	}

	public boolean playerAttackCard(ActionContextTemplate contextTemplate) {
		return this.execute(new AttackAction(), contextTemplate);
	}

	public boolean playerEquipCard(ActionContextTemplate contextTemplate) {
		return this.execute(new EquipAction(), contextTemplate);
	}

	public boolean playerUseSpell(ActionContextTemplate contextTemplate) {
		return this.execute(null, contextTemplate); // TODO pending
	}

	public boolean playerSurrender(ActionContextTemplate contextTemplate) {
		return this.execute(new SurrenderAction(), contextTemplate);
	}

	public boolean playerPassTurn(ActionContextTemplate contextTemplate) {
		return this.execute(new PassTurnAction(), contextTemplate);
	}

	private ActionContext createContext(ActionContextTemplate contextTemplate) {
		return this.contextFactory.createContextFromTemplate(contextTemplate);
	}

	private boolean execute(Action action, ActionContextTemplate contextTemplate) {
		return action.perform(this.createContext(contextTemplate));
	}
}
