package com.dainws.games.crm.console.factories.game;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Supplier;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.crm.console.domain.models.GameMode;
import com.dainws.games.crm.console.domain.models.Party;

public class GameFactory {
	private Map<GameMode, Supplier<AbstractGameFactory>> factories;
	
	public GameFactory() {
		this.factories = new EnumMap<>(GameMode.class);
		this.factories.put(GameMode.CLASSIC, ClassicGameFactory::new);
	}
	
	public Game createGame(Party party) {
		AbstractGameFactory factory = this.getGameModeFactory(party.getGameMode());
		return factory.create(party);
	}
	
	private AbstractGameFactory getGameModeFactory(GameMode gameMode) {
		return this.factories.get(gameMode).get();
	}
}
