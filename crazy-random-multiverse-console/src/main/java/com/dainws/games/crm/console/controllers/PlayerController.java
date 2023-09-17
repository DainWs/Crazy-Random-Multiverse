package com.dainws.games.crm.console.controllers;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.dainws.games.cbg.domain.player.Player;

@Component
public class PlayerController {
	
	private Console console;
	
	public PlayerController(Console console) {
		this.console = console;
	}

	public void onPlayerGetTurn(Player player) {
		// TODO lanzar evento paralelo para el reparto de las cartas
		// TODO mostrar opciones del turno
	}
	
}
