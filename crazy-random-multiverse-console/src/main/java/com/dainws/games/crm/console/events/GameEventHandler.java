package com.dainws.games.crm.console.events;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.crm.console.controllers.Console;

@Component
public class GameEventHandler {

	private Console console;

	public GameEventHandler(Console console) {
		this.console = console;
	}

	@EventListener(condition = "#event.key == T(com.dainws.games.crm.console.events.EventKey).GAME_START_EVENT")
	public void onGameStart(GameEvent event) {
		this.console.show("El juego ha comenzado");
	}

	@EventListener(condition = "#event.key == T(com.dainws.games.crm.console.events.EventKey).GAME_END_EVENT")
	public void onGameEnd(Game cardBattleGame) {
		this.console.show("El juego ha acabado");
	}
}
