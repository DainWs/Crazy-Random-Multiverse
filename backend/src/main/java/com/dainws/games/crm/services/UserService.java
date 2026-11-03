package com.dainws.games.crm.services;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.repositories.UserRepository;
import com.dainws.games.crm.usecase.dto.CreatePartyRequest;

@Service
public class UserService {
	private UserRepository userRepository;
	private PartyService partyService;
	private Clock clock;

	@Value("${crm.user.disconnect-grace-period}")
	private Duration disconnectGracePeriod;

	private final Logger logger;

	public UserService(UserRepository userRepository, PartyService partyService) {
		this.userRepository = userRepository;
		this.partyService = partyService;
		this.clock = Clock.systemUTC();
		this.logger = LoggerFactory.getLogger(getClass());
	}
	
	public List<Party> getParties() {
		return this.partyService.getParties();
	}
	
	public Party createParty(User partyOwner, CreatePartyRequest request) {
		GameMode gameMode = request.getGameMode().getDomainGameMode();

		Party party = new Party(partyOwner, gameMode);
		party.setMaxUsers(request.getMaxUsers());

		return this.partyService.createParty(party);
	}
	
	public Party joinParty(PartyCode partyCode, User user) {
		return this.partyService.joinParty(partyCode, user);
	}
	
	public Optional<Party> findPartyOf(User user) {
		return this.partyService.findPartyOf(user);
	}

	public boolean exists(UserCode code) {
		return this.userRepository.has(code);
	}

	public User get(UserCode code) {
		return this.userRepository.find(code);
	}
	
	public void create(User user) {
		user.startWaitingForSocket(this.clock.instant());
		this.userRepository.save(user);
	}

	public void update(User user) {
		this.userRepository.save(user);
	}

	public void deleteDisconnectedUsers() {
		Instant now = this.clock.instant();

		for (User user : this.userRepository.findAll()) {
			if (user.hasBeenWithoutSocketLongerThan(this.disconnectGracePeriod, now)) {
				this.logger.info("Deleting user {} after the grace period without a socket", user.getCode());
				this.delete(user.getCode());
			}
		}
	}

	public void delete(UserCode userCode) {
		User user = this.userRepository.find(userCode);
		this.partyService.leaveParty(user);
		this.userRepository.delete(userCode);
	}

	@Autowired
	public void setClock(Clock clock) {
		this.clock = clock;
	}

	public void setDisconnectGracePeriod(Duration disconnectGracePeriod) {
		this.disconnectGracePeriod = disconnectGracePeriod;
	}
}
