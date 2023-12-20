package com.dainws.games.crm.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.cbg.domain.action.Action;
import com.dainws.games.cbg.domain.action.ActionContext;
import com.dainws.games.cbg.domain.action.AttackAction;
import com.dainws.games.cbg.domain.action.EquipAction;
import com.dainws.games.cbg.domain.action.MoveAction;
import com.dainws.games.cbg.domain.action.PassTurnAction;
import com.dainws.games.cbg.domain.action.PutAction;
import com.dainws.games.cbg.domain.action.SurrenderAction;
import com.dainws.games.cbg.domain.communication.GameChannel;
import com.dainws.games.cbg.domain.communication.GameEventListener;
import com.dainws.games.cbg.domain.communication.PlayerEventListener;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.crm.game.ActionContextFactory;
import com.dainws.games.crm.game.ActionContextTemplate;
import com.dainws.games.crm.persistence.CardRepository;
import com.dainws.games.crm.persistence.GameRepository;

public class PlayerFacade {

	private ActionContextFactory contextFactory;
	private GameChannel gameChannel;
	private Logger logger;

	public PlayerFacade(GameRepository gameRepository, CardRepository cardRepository, GameChannel gameChannel) {
		this.contextFactory = new ActionContextFactory(gameRepository, cardRepository);
		this.gameChannel = gameChannel;
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void playerPutCard(ActionContextTemplate contextTemplate) {
		
		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);

			Action action = new PutAction();
			this.prepareAction(action);
			action.perform(actionContext);
			
			this.logger.debug("El jugador {}, ha puesto una carta", actionContext.getSourcePlayer().getName());
		} catch (PlayerActionException e) {
			this.processPlayerActionException(e);
		}
	}

	public void playerMoveCard(ActionContextTemplate contextTemplate) {

		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);

			Action action = new MoveAction();
			this.prepareAction(action);
			action.perform(actionContext);

			this.logger.debug("El jugador {}, ha movido una carta", actionContext.getSourcePlayer().getName());
		} catch (PlayerActionException e) {
			this.processPlayerActionException(e);
		}
	}

	public void playerAttackCard(ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);

			Action action = new AttackAction();
			this.prepareAction(action);
			action.perform(actionContext);

			this.logger.debug("El jugador {}, ha atacado con una carta", actionContext.getSourcePlayer().getName());
		} catch (PlayerActionException e) {
			this.processPlayerActionException(e);
		}
	}

	public void playerEquipCard(ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);

			Action action = new EquipAction();
			this.prepareAction(action);
			action.perform(actionContext);

			this.logger.debug("El jugador {}, ha equipado una carta", actionContext.getSourcePlayer().getName());
		} catch (PlayerActionException e) {
			this.processPlayerActionException(e);
		}
	}

	public void playerUseSpell(ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);

			// TODO None defined yet
			this.logger.debug("El jugador {}, ha utilizado un hechizo", actionContext.getSourcePlayer().getName());
		} catch (Exception e) {
			// TODO
		}
	}

	public void playerPassTurn(ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);
			
			Action action = new PassTurnAction();
			this.prepareAction(action);
			action.perform(actionContext);

			this.logger.debug("El jugador {}, ha pasado de turno", actionContext.getSourcePlayer().getName());
		} catch (PlayerActionException e) {
			this.processPlayerActionException(e);
		}
	}

	public void playerSurrender(ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.contextFactory.createActionContextFromTemplate(contextTemplate);

			Action action = new SurrenderAction();
			this.prepareAction(action);
			action.perform(actionContext);

			this.logger.debug("El jugador {} se ha rendido", actionContext.getSourcePlayer().getName());
		} catch (PlayerActionException e) {
			this.processPlayerActionException(e);
		}
	}
	
	private void prepareAction(Action action) {
		action.setGameEventListener(new GameEventListener(this.gameChannel));
		action.setPlayerEventListener(new PlayerEventListener(this.gameChannel));
	}
	
	private void processPlayerActionException(PlayerActionException exception) {
		ErrorAdapter adapter = new ErrorAdapter(this.gameChannel);
		adapter.sendErrorToPlayer(exception.getSource(), exception.toError());
	}
}
