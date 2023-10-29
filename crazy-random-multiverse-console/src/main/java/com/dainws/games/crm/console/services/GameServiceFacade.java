package com.dainws.games.crm.console.services;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Supplier;

import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.crm.console.domain.models.GameMode;
import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.factories.game.ClassicGameFactory;
import com.dainws.games.crm.console.factories.game.GameAbstractFactory;

@Service
public class GameService {

	private Map<GameMode, Supplier<GameAbstractFactory>> factories;
	
	public GameService() {
		this.factories = new EnumMap<>(GameMode.class);
		this.factories.put(GameMode.CLASSIC, ClassicGameFactory::new);
	}
	
	public Game createGame(Party party) {
		GameAbstractFactory factory = this.getGameModeFactory(party.getGameMode());
		return factory.create(party);
	}
	
	public void endGame(Game cardBattleGame) {
		
	}
	
	private GameAbstractFactory getGameModeFactory(GameMode gameMode) {
		return this.factories.get(gameMode).get();
	}
}
