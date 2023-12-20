package com.dainws.games.crm.services;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.communication.GameChannel;
import com.dainws.games.cbg.domain.communication.GameEventListener;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.persistence.exceptions.GameNotFoundException;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;

public class GameFacade {

	private PartyService partyService;
	private GameService gameService;
	private GameEventListener gameEventListener;
	private Map<GameCode, Set<User>> preparedPlayers;
	private Logger logger;

	public GameFacade(GameService gameService, PartyService partyService, GameChannel gameChannel) {
		this.gameService = gameService;
		this.partyService = partyService;
		this.gameEventListener = new GameEventListener(gameChannel);
		this.preparedPlayers = new HashMap<>();
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public void createGame(User partyOwner) throws PartyNotFoundException {
		Party party = this.partyService.getPartyWhereUserIsOwner(partyOwner);
		this.partyService.lockParty(party);

		Game game = this.gameService.createFrom(party);

		this.logger.info("Esperando a que todos los jugadores del juego {} esten listos", game.getCode());
		this.preparedPlayers.put(game.getCode(), new HashSet<>());
		this.gameEventListener.onGameIsCreated(game);
	}

	public void setPlayerReady(User user) throws PartyNotFoundException, GameNotFoundException {
		Party party = this.partyService.getPartyWhereUserIsPlayer(user);
		GameCode gameCode = GameCode.fromString(party.getCodeValue());

		if (!this.preparedPlayers.containsKey(gameCode)) {
			throw new GameNotFoundException();
		}

		Set<User> users = this.preparedPlayers.get(gameCode);
		users.add(user);

		this.logger.debug("[{}/{}] El jugador {} esta listo", users.size(), party.getUsers().size(), user.getName());
		Game game = this.gameService.findGame(gameCode);
		if (users.size() >= game.getPlayers().size()) {
			this.logger.debug("Todos los jugadores del juego {} estan listos para comenzar", game.getCode());
			this.preparedPlayers.remove(gameCode);
			this.startGame(game);
		}
	}

	private void startGame(Game game) {
		this.logger.info("Comenzando el juego {}", game.getCode());
		this.gameEventListener.onGameIsStarted(game);
		// TODO reparte los lideres
		// TODO envia el evento de carta repartida
	}
}
