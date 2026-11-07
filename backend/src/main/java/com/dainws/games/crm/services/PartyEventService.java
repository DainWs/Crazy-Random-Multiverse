package com.dainws.games.crm.services;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.UserClient;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.repositories.GameRepository;
import com.dainws.games.crm.domain.repositories.PartyRepository;

@Service
public class PartyEventService {
	private UserClient userClient;
	private Clock clock;
	private PartyRepository repository;
	private GameRepository gameRepository;
	private TaskScheduler scheduler;
	private Map<GameCode, ScheduledFuture<?>> pendingReleases;

	@Value("${crm.game.result-duration}")
	private Duration resultDuration;

	public PartyEventService(PartyRepository repository, GameRepository gameRepository, TaskScheduler scheduler) {
		this.userClient = UserClient.NONE;
		this.clock = Clock.systemUTC();
		this.repository = repository;
		this.gameRepository = gameRepository;
		this.scheduler = scheduler;
		this.pendingReleases = new ConcurrentHashMap<>();
	}

	@EventListener
	public void releasePartiesWhenGameFinishes(Event event) {
		if (event.getCode() == EventCode.GAME_END) {
			this.scheduleRelease(event.getGameCode());
		} else if (event.getCode() == EventCode.GAME_CANCELLED) {
			this.releaseGameParties(event.getGameCode());
		}
	}

	public void releaseGameParties(GameCode code) {
		this.pendingReleases.remove(code);

		List<Party> parties = this.repository.findPartiesInGame(code);
		for (Party party : parties) {
			party.setCurrentGame(GameCode.NONE);
			this.repository.save(party);
		}

		this.gameRepository.delete(code);

		for (Party party : parties) {
			this.sendOrRemove(party);
		}
	}

	private void sendOrRemove(Party party) {
		if (party.isEmpty()) {
			this.repository.delete(party.getCode());
		} else {
			this.userClient.sendPartyInfo(party);
		}
	}

	public void discardGameOf(Party party) {
		GameCode code = party.getCurrentGame();

		ScheduledFuture<?> pendingRelease = this.pendingReleases.remove(code);
		if (pendingRelease != null) {
			pendingRelease.cancel(false);
		}

		this.gameRepository.delete(code);
	}

	private void scheduleRelease(GameCode code) {
		Instant releaseTime = this.clock.instant().plus(this.resultDuration);
		this.pendingReleases.put(code, this.scheduler.schedule(() -> this.releaseGameParties(code), releaseTime));
	}

	@Autowired
	public void setUserClient(UserClient userClient) {
		this.userClient = userClient;
	}

	@Autowired
	public void setClock(Clock clock) {
		this.clock = clock;
	}

	public void setResultDuration(Duration resultDuration) {
		this.resultDuration = resultDuration;
	}
}
