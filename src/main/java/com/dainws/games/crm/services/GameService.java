package com.dainws.games.crm.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.event.ConsoleEventPublisher;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;
import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.GameCode;
import com.dainws.games.crm.domain.models.User;
import com.dainws.games.crm.domain.ports.GameRepository;
import com.dainws.games.crm.domain.ports.PartyRepository;

@Service
public class GameService implements EventTrigger {
	private GameFactory gameFactory;
	private GameRepository gameRepository;
	private EventPublisher eventPublisher;
	private Logger logger;

	public GameService(GameRepository gameRepository, PartyRepository partyRepository) {
		this.gameFactory = new GameFactory(partyRepository);
		this.gameRepository = gameRepository;
		this.eventPublisher = new ConsoleEventPublisher();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public Game createGameFromPartyOwner(User partyOwner) {
		Game game = this.gameFactory.createGameFromPartyOwner(partyOwner);

		this.gameRepository.save(game);
		this.logger.trace("El juego con codigo {} ha sido creado", game.getCode());

		this.publishGameCreatedEvent(game);
		return game;
	}

	private void publishGameCreatedEvent(Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		this.eventPublisher.publish(new Event(EventCode.GAME_CREATED, details));
	}

	public void delete(GameCode gameCode) {
		this.gameRepository.delete(gameCode);
		this.logger.trace("El juego con codigo {} ha sido borrado", gameCode);
	}

	public Game findGame(GameCode gameCode) {
		return this.gameRepository.find(gameCode);
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
