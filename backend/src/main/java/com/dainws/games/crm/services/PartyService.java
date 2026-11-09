package com.dainws.games.crm.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.GameRuntimeException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.repositories.GameRepository;
import com.dainws.games.crm.domain.repositories.PartyRepository;
import com.dainws.games.crm.services.exception.PartyException;

@Service
public class PartyService {

	private UserClient userClient;
	private PartyEventService partyEventService;
	private PartyRepository repository;
	private GameRepository gameRepository;

	public PartyService(PartyRepository repository) {
		this.repository = repository;
	}

	public Party createParty(Party party) throws PartyException {
		User partyOwner = party.getOwner();

		if (this.repository.hasPartyWhereUserIsMember(partyOwner)) {
			throw PartyException.userAlreadyInParty();
		}

		this.repository.save(party);
		return party;
	}

	public Party joinParty(PartyCode partyCode, User user) throws PartyException {
		if (this.repository.hasPartyWhereUserIsMember(user)) {
			throw PartyException.userAlreadyInParty();
		}

		try {
			Party party = this.repository.find(partyCode);
			party.add(user);
			this.repository.save(party);
			this.userClient.sendPartyInfo(party);
			return party;
		} catch (NotAllowedException e) {
			throw new PartyException(e.getCode(), e);
		}

	}

	public void leaveDeletedUser(User user) {
		if (!this.repository.hasPartyWhereUserIsMember(user)) {
			return;
		}

		Party party = this.repository.findPartyWhereUserIsMember(user.getCode());
		party.removeWhenUnlocked(user.getCode());

		if (party.isEmpty()) {
			this.deleteParty(party);
		} else {
			this.userClient.sendPartyInfo(party);
		}
	}

	public void leaveParty(PartyCode partyCode, User user) throws PartyException {
		try {
			Party party = this.repository.find(partyCode);
			Optional<Player> spectator = this.findSpectatorOf(party, user);
			if (spectator.isPresent()) {
				spectator.get().leave();
				party.removeSpectator(user.getCode());
			} else {
				party.remove(user);
			}

			if (party.isEmpty()) {
				this.deleteParty(party);
			} else {
				this.userClient.sendPartyInfo(party);
			}
		} catch (GameException e) {
			throw new PartyException(e.getCode(), e);
		} catch (GameRuntimeException e) {
			throw new PartyException(e.getCode(), e);
		}
	}

	private Optional<Player> findSpectatorOf(Party party, User user) {
		if (!party.isLocked() || !this.gameRepository.exists(party.getCurrentGame())) {
			return Optional.empty();
		}

		Game game = this.gameRepository.find(party.getCurrentGame());
		Player player = game.getPlayer(PlayerCode.from(user.getCode().text()));
		if (player == null || player.isNotSpectator()) {
			return Optional.empty();
		}

		return Optional.of(player);
	}

	private void deleteParty(Party party) {
		if (party.isLocked()) {
			this.partyEventService.discardGameOf(party);
		}

		this.repository.delete(party.getCode());
	}

	public Optional<Party> findPartyOf(User user) {
		if (!this.repository.hasPartyWhereUserIsMember(user)) {
			return Optional.empty();
		}

		return Optional.of(this.repository.findPartyWhereUserIsMember(user.getCode()));
	}

	public List<Party> getParties() {
		return this.repository.findAll();
	}

	@Autowired
	public void setPartyEventService(PartyEventService partyEventService) {
		this.partyEventService = partyEventService;
	}

	@Autowired
	public void setGameRepository(GameRepository gameRepository) {
		this.gameRepository = gameRepository;
	}

	@Autowired
	public void setUserClient(UserClient userClient) {
		this.userClient = userClient;
	}
}
