package com.dainws.games.crm.persistence.action;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.action.ActionContext;
import com.dainws.games.cbg.domain.action.ActionContextFactory;
import com.dainws.games.cbg.domain.action.ActionContextTemplate;
import com.dainws.games.crm.domain.CardRepository;
import com.dainws.games.crm.domain.GameRepository;

public class JPAActionContextFactory implements ActionContextFactory {

	private GameRepository gameRepository;
	private CardRepository cardRepository;

	public JPAActionContextFactory(GameRepository gameRepository, CardRepository cardRepository) {
		this.gameRepository = gameRepository;
		this.cardRepository = cardRepository;
	}

	@Override
	public ActionContext createContextFromTemplate(ActionContextTemplate contextTemplate) {
		Game game = this.gameRepository.find(contextTemplate.getGameCode());
		JPAActionContext context = new JPAActionContext();
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
