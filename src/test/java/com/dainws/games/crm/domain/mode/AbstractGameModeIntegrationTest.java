package com.dainws.games.crm.domain.mode;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameState;
import com.dainws.games.crm.domain.core.GameStateManager;
import com.dainws.games.crm.domain.repositories.GameRepository;

public abstract class AbstractGameModeIntegrationTest {

	@Autowired
	private GameStateManager gameStateManager;

	@Autowired
	private GameRepository gameRepository;
	
	protected Game game;
	
	@BeforeEach
	final void abstractBeforeEach() {
		Party party = this.createParty();
		this.game = this.createGameModeFactory().createGame(party);
		this.gameRepository.save(this.game);
	}

	public void beforeEach() {};

	protected Party createParty() {
		return null;
	}
	
	protected abstract GameModeFactory createGameModeFactory();
	
	protected final void startGame() {
		this.game.setState(GameState.BEFORE_START);
		this.gameStateManager.next(this.game);
	}
}
