package com.dainws.games.crm.services;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.crm.game.ClassicGameFactory;
import com.dainws.games.crm.persistence.CardRepository;
import com.dainws.games.crm.persistence.GameRepository;
import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.persistence.exceptions.GameNotFoundException;

@Service
public class GameService {
	private GameRepository gameRepository;
	private CardRepository cardRepository;
	private Logger logger;

	public GameService(GameRepository gameRepository, CardRepository cardRepository) {
		this.gameRepository = gameRepository;
		this.cardRepository = cardRepository;
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public Game createFrom(Party party) {		
		this.logger.trace("Creando juego para la fiesta {}", party.getCodeValue());
		Set<Card> cards = this.cardRepository.findAll();
		Game classicGame = new ClassicGameFactory()
				.create(party, cards);

		this.gameRepository.save(classicGame);
		this.logger.trace("El juego para la fiesta {} ha sido creado", party.getCodeValue());
		return classicGame;
	}

	public void save(Game game) {
		this.gameRepository.save(game);
	}

	public void delete(GameCode gameCode) {
		this.gameRepository.delete(gameCode);
	}

	public Game findGame(GameCode gameCode) throws GameNotFoundException {
		return this.gameRepository.find(gameCode);
	}
}
