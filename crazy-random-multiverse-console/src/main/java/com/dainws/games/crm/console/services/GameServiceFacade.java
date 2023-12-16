package com.dainws.games.crm.console.services;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.crm.console.domain.models.GameMode;
import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.factories.game.GameFactory;

@Service
public class GameServiceFacade {

	private List<AbstractGameService> gameServices;
	private ApplicationEventPublisher eventPublisher;

	public GameServiceFacade(List<AbstractGameService> gameServices, ApplicationEventPublisher eventPublisher) {
		this.gameServices = gameServices;
		this.eventPublisher = eventPublisher;
	}
	
	public Game createGame(Party party) {
		return new GameFactory().createGame(party);
	}
	
	public void startGame(Game game) {
		this.findGameServiceBy(GameMode.CLASSIC).startGame(game);
	}
	
	public void endGame(Game game) {
		this.findGameServiceBy(GameMode.CLASSIC).endGame(game);
	}
	
	private AbstractGameService findGameServiceBy(GameMode supportedGameMode) {
		return this.gameServices.stream()
				.filter(service -> service.supports(GameMode.CLASSIC)) // TODO to dinamic mode
				.findFirst()
				.orElseThrow();
	}
}
