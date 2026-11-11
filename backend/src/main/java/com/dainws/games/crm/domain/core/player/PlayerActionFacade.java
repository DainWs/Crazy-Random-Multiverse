package com.dainws.games.crm.domain.core.player;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionResult;
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

	public ActionResult playerPutCard(ActionContextTemplate contextTemplate) {
		return this.execute(new PutAction(), contextTemplate);
	}

	public ActionResult playerMoveCard(ActionContextTemplate contextTemplate) {
		return this.execute(new MoveAction(), contextTemplate);
	}

	public ActionResult playerAttackCard(ActionContextTemplate contextTemplate) {
		return this.execute(new AttackAction(), contextTemplate);
	}

	public ActionResult playerEquipCard(ActionContextTemplate contextTemplate) {
		return this.execute(new EquipAction(), contextTemplate);
	}

	public ActionResult playerUseSpell(ActionContextTemplate contextTemplate) {
		return this.execute(null, contextTemplate); // TODO Post-MVP (SPELL-4): pass UseSpellAction, a null action fails
	}

	public ActionResult playerSurrender(ActionContextTemplate contextTemplate) {
		return this.execute(new SurrenderAction(), contextTemplate);
	}

	public ActionResult playerPassTurn(ActionContextTemplate contextTemplate) {
		return this.execute(new PassTurnAction(), contextTemplate);
	}

	private ActionContext createContext(ActionContextTemplate contextTemplate) {
		return this.contextFactory.createContextFromTemplate(contextTemplate);
	}

	private ActionResult execute(Action action, ActionContextTemplate contextTemplate) {
		return action.perform(this.createContext(contextTemplate));
	}
}
