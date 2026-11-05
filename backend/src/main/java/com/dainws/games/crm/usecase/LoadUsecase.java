package com.dainws.games.crm.usecase;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.repositories.CardRepository;
import com.dainws.games.crm.domain.repositories.GameRepository;
import com.dainws.games.crm.domain.resources.CardResource;
import com.dainws.games.crm.domain.resources.FixedResource;
import com.dainws.games.crm.domain.resources.Manifest;
import com.dainws.games.crm.services.exception.AccessDeniedException;

@Component
public class LoadUsecase {

	@Value("${crm.resources.url-prefix}")
	private String resourcesUrlPrefix;

	private GameRepository gameRepository;
	private CardRepository cardRepository;

	public LoadUsecase(GameRepository gameRepository, CardRepository cardRepository) {
		this.gameRepository = gameRepository;
		this.cardRepository = cardRepository;
	}

	public Manifest getManifest(GameCode gameCode, PlayerCode playerCode) {
		Game game = this.gameRepository.find(gameCode);
		if (game.getPlayer(playerCode) == null) {
			throw AccessDeniedException.wrongGame();
		}

		Manifest manifest = new Manifest(this.resourcesUrlPrefix);
		for (FixedResource fixedResource : FixedResource.values()) {
			manifest.addFixed(fixedResource);
		}
		for (Card card : this.cardRepository.findAll()) {
			manifest.addCard(CardResource.from(card));
		}
		return manifest;
	}

	public void setResourcesUrlPrefix(String resourcesUrlPrefix) {
		this.resourcesUrlPrefix = resourcesUrlPrefix;
	}
}
