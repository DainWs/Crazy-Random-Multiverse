package com.dainws.games.crm.console.events;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.dainws.games.cbg.domain.action.PutAction;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.crm.console.controllers.Console;

@Component
public class PlayerActionEventHandler {
	private Console console;

	public PlayerActionEventHandler(Console console) {
		this.console = console;
	}
	
	@EventListener()
	public void onPlayerPutCard(PutAction action) { // TODO tal vez en vez de acciones sean ActionEvent?
		Player sourcePlayer = action.getSourcePlayer();
		Card card = sourcePlayer.getHand().getCard(action.getSelectedCardCode());
		Position targetPosition = action.getTargetPosition();
		
		this.console.show("El jugador " + sourcePlayer.getName() + " ha puesto la carta [" + card.getName()+"] en la posicion " + targetPosition);
	}
}
