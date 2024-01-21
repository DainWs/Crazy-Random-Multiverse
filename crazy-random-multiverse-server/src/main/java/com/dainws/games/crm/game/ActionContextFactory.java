package com.dainws.games.crm.game;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.action.ActionContext;
import com.dainws.games.crm.persistence.CardRepository;
import com.dainws.games.crm.persistence.GameRepository;

public class ActionContextFactory {

	private GameRepository gameRepository;
	private CardRepository cardRepository;

	public ActionContextFactory(GameRepository gameRepository, CardRepository cardRepository) {
		this.gameRepository = gameRepository;
		this.cardRepository = cardRepository;
	}

	public ActionContext createActionContextFromTemplate(ActionContextTemplate contextTemplate) {
		Game game = this.gameRepository.find(contextTemplate.getGameCode());
		ActionContextImpl context = new ActionContextImpl();
		context.setGame(game);

		if (contextTemplate.isSourcePlayerRequired()) {
			context.setSourcePlayer(game.getPlayer(contextTemplate.getSourcePlayerCode()));
		}

		if (contextTemplate.isTargetPlayerRequired()) {
			context.setTargetPlayer(game.getPlayer(contextTemplate.getTargetPlayerCode()));
		}

		context.setSourceCard(this.cardRepository.find(contextTemplate.getSourceCardCode()));
		context.setSourceCoordinate(contextTemplate.getSourceCoordinate());
		context.setTargetCard(this.cardRepository.find(contextTemplate.getTargetCardCode()));
		context.setTargetCoordinate(contextTemplate.getTargetCoordinate());
		return context;
	}
}
