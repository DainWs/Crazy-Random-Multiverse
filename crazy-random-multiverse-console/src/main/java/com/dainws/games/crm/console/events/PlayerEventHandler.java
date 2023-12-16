package com.dainws.games.crm.console.events;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.crm.console.controllers.Console;

@Component
public class PlayerEventHandler {

	private Console console;

	public PlayerEventHandler(Console console) {
		this.console = console;
	}

	@EventListener(condition = "#event.key == T(com.dainws.games.crm.console.events.EventKey).PLAYER_GET_TURN")
	public void onPlayerGetTurn(PlayerEvent event) {
		Player playerWithTurn = event.getSource();
		this.console.show("Es el turno del jugador " + playerWithTurn.getName());

		
		String[] options = {
			"Mostrar zona",
			"Poner carta",
			"Pasar"
		};

		boolean passTurn = false;
		do {
			int selectedOption = this.console.select(options);
			if (selectedOption == 0) {
				this.console.show(playerWithTurn.getZone());
			} else if (selectedOption == 1) {
				this.console.show(playerWithTurn.getHand());
			} else {
				this.console.show("Pasando turno");
				passTurn = true;
			}
		} while (!passTurn);
	}

	@EventListener(condition = "#event.key == T(com.dainws.games.crm.console.events.EventKey).PLAYER_GET_CARDS")
	public void onPlayerGetCards(PlayerEvent event) {
		this.console.show("Se han repartido cartas al jugador " + event.getSource().getName());
	}

	@EventListener(condition = "#event.key == T(com.dainws.games.crm.console.events.EventKey).PLAYER_WIN")
	public void onPlayerWin(PlayerEvent event) {
		this.console.show("Gana el jugador " + event.getSource().getName());
	}

	@EventListener(condition = "#event.key == T(com.dainws.games.crm.console.events.EventKey).PLAYER_LOSE")
	public void onPlayerLose(PlayerEvent event) {
		this.console.show("El jugador " + event.getSource().getName() + " ha perdido");
	}
}
