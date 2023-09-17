package com.dainws.games.crm.console.events;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.crm.console.controllers.Console;

public class GameStateEventPublisher {
	
	private Console console;
	
	public GameStateEventPublisher(Console console) {
		this.console = console;
	}

	public void onGameStart(Game cardBattleGame) {
		this.console.show("El juego ha comenzado");
	}

	public void onGameEnd(Game cardBattleGame) {
		this.console.show("El juego ha acabado");
	}

	public void onPlayerGetTurn(Player player) {
		this.console.show("Es el turno del jugador " + player.getName());
	}

	public void onPlayerPassTurn(Player player) {
		this.console.show("El jugador " + player.getName() + " ha pasado turno");
	}

	public void onPlayerWin(Player player) {
		this.console.show("Gana el jugador " + player.getName());
	}

	public void onPlayerLose(Player player) {
		this.console.show("El jugador " + player.getName() + " ha perdido");
	}
}
