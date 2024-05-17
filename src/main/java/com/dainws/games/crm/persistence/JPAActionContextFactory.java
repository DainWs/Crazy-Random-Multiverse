package com.dainws.games.crm.persistence;

import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.action.ActionContext;
import com.dainws.games.crm.domain.models.action.ActionContextFactory;
import com.dainws.games.crm.domain.models.action.ActionContextTemplate;
import com.dainws.games.crm.domain.ports.CardRepository;
import com.dainws.games.crm.domain.ports.GameRepository;

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