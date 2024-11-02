package com.dainws.games.crm.domain;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameLoader;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.core.exception.OperationNotAllowedException;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.mode.GameFactory;
import com.dainws.games.crm.domain.repositories.GameRepository;
import com.dainws.games.crm.domain.repositories.PartyRepository;

public class PartyService implements EventTrigger {
	private Logger logger;
	private UserClient userClient;
	private GameLoader gameLoader;
	private GameFactory gameFactory;
	private GameRepository gameRepository;
	private EventPublisher eventPublisher;
	private PartyRepository partyRepository;

	public PartyService(GameRepository gameRepository, PartyRepository partyRepository) {
		this.logger = System.getLogger("PartyService");
		this.userClient = UserClient.NONE;
		this.gameLoader = new GameLoader();
		this.gameFactory = new GameFactory();
		this.gameRepository = gameRepository;
		this.eventPublisher = EventPublisher.NONE;
		this.partyRepository = partyRepository;
	}

	public void loadGame(User owner) {
		Party party = this.partyRepository.findPartyWhereUserIsOwner(owner);
		this.lockParty(party);

		Game game = this.gameFactory.createGame(party);
		this.gameRepository.save(game);
		this.logger.log(Level.INFO, "El juego con codigo %s ha sido creado", game.getCode());

		this.gameLoader.load(game);

		EventDetails details = new EventDetails(game);
		Event event = new Event(EventCode.GAME_STARTING, details);
		this.eventPublisher.publish(event);
	}

	public void markUserAsReady(GameCode gameCode, User user) {
		PlayerCode playerCode = PlayerCode.from(user.getCode().getValue());
		this.gameLoader.tryMarkPlayerAsReady(gameCode, playerCode);
	}
	
	public void loadPartyFromGame(GameCode gameCode) {
		this.logger.log(Level.INFO, "Devolviendo a los jugadores del juego %s la sala de espera", gameCode);
		Game game = this.gameRepository.find(gameCode);

		if (this.canLoadPartyFromGame(game)) {
			User user = this.findUserPlayer(game).toUser();
			Party party = this.partyRepository.findPartyWhereUserIsPresent(user);
			this.unlockParty(party);
		}
		this.gameRepository.delete(gameCode);
	}
	
	private boolean canLoadPartyFromGame(Game game) {
		return game.getPlayers().stream()
				.anyMatch(player -> player instanceof UserPlayer);
	}
	
	private UserPlayer findUserPlayer(Game game) {
		return (UserPlayer) game.getPlayers().stream()
				.filter(player -> player instanceof UserPlayer)
				.findFirst()
				.orElseThrow(NotFoundException::playerNotFound);
	}

	public void createParty(User partyOwner) throws OperationNotAllowedException {
		if (this.partyRepository.hasPartyWhereUserIsPresent(partyOwner)) {
			throw new OperationNotAllowedException("user_already_in_party");
		}

		Party party = new Party(partyOwner);
		this.partyRepository.save(party);

		this.sendPartyInfoTo(partyOwner, party);
	}

	public void joinParty(PartyCode partyCode, User user) throws OperationNotAllowedException {
		if (this.partyRepository.hasPartyWhereUserIsPresent(user)) {
			throw new OperationNotAllowedException("user_already_in_party");
		}

		Party party = this.partyRepository.find(partyCode);
		party.add(user);

		this.sendPartyInfoTo(party.getUsers(), party);
	}

	public void leaveParty(User user) throws NotFoundException, OperationNotAllowedException {
		Party party = this.partyRepository.findPartyWhereUserIsPresent(user);
		party.remove(user);

		this.sendPartyInfoTo(party.getUsers(), party);

		if (party.isEmpty()) {
			this.partyRepository.delete(party.getCode());
		}
	}

	public void tryLeaveParty(User user) {
		try {
			if (this.partyRepository.hasPartyWhereUserIsPresent(user)) {
				this.leaveParty(user);
			}
		} catch (NotFoundException | OperationNotAllowedException e) {}
	}

	public void updatePartyListOf(User user) {
		List<Party> parties = this.partyRepository.findAll();
		this.userClient.sendPartyList(user, parties);
	}

	public void lockParty(Party party) {
		party.lock();
		this.partyRepository.save(party);
	}

	public void unlockParty(Party party) {
		party.unlock();
		this.partyRepository.save(party);
	}

	private void sendPartyInfoTo(List<User> users, Party party) {
		for (User user : users) {
			this.sendPartyInfoTo(user, party);
		}
	}

	private void sendPartyInfoTo(User user, Party party) {
		this.userClient.sendPartyInfo(user, party);
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void setGameFactory(GameFactory gameFactory) {
		this.gameFactory = gameFactory;
	}

	public void setUserClient(UserClient userClient) {
		this.userClient = userClient;
	}

}
