package com.dainws.games.crm.event;

import org.springframework.context.ApplicationListener;
import org.springframework.context.PayloadApplicationEvent;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ActiveProfiles;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

@Component
@ActiveProfiles({ "debug" })
public class GameEventDebuger implements ApplicationListener<PayloadApplicationEvent<Event>> {

	private StringBuilder textBuilder;
	
	@Override
	public void onApplicationEvent(PayloadApplicationEvent<Event> payloadEvent) {
		Event event = payloadEvent.getPayload();
		Game game = event.getDetails().getGame();
		if (this.shouldDebug(event)) {
			this.debugGame(event.getCode(), game);
		}
	}
	
	private boolean shouldDebug(Event event) {	
		EventCode eventCode = event.getCode();
		if (EventCode.GAME_START.equals(eventCode)) {
			return true;
		}

		if (EventCode.TURN_CHANGE.equals(eventCode)) {
			return true;
		}
		
		if (EventCode.GAME_END_WITH_TIE.equals(eventCode)) {
			return true;
		}

		if (EventCode.GAME_END_WITH_WINNER.equals(eventCode)) {
			return true;
		}		
		return false;
	}

	private synchronized void debugGame(EventCode code, Game game) {
		this.textBuilder = new StringBuilder();

		synchronized (game) {
			this.textBuilder.append("-".repeat(100)).append("\n");
			this.textBuilder.append("Event code: " + code).append("\n");
			this.textBuilder.append("CardsGame code: " + game.getCode()).append("\n");
			this.textBuilder.append("CardsGame mode: " + game.getMode()).append("\n");
			this.textBuilder.append("CardsGame turn: " + game.getTurn()).append("\n");
			this.debugAlivePlayers(game, game.getAlivePlayers());
			this.debugDeathPlayers(game, game.getDeathPlayers());
		}
		
		System.out.println(this.textBuilder.toString());
	}
	
	private void debugAlivePlayers(Game game, PlayerStorage alivePlayers) {
		synchronized (alivePlayers) {
			this.textBuilder.append("CardsGame alive players: " + game.getAlivePlayers().size()).append("\n");
			for (Player player : game.getAlivePlayers()) {
				this.textBuilder.append("|_ \n");
				this.textBuilder.append("||-" + player.getName()).append("\n");
				this.debugPlayer(player, game.getBoard().getZoneOf(player));
			}			
		}
	}
	
	private void debugDeathPlayers(Game game, PlayerStorage deathPlayers) {
		synchronized (deathPlayers) {
			this.textBuilder.append("CardsGame death players: " + game.getDeathPlayers().size()).append("\n");
			for (Player player : game.getDeathPlayers()) {
				this.textBuilder.append(" - " + player.getName()).append("\n");
				this.debugPlayer(player, game.getBoard().getZoneOf(player));
			}		
		}
	}
	
	private void debugPlayer(Player player, Zone zone) {
		synchronized (player) {
			this.textBuilder.append("||-Hand\n");
			Hand hand = player.getHand();
			for (Card card : hand.getCards()) {
				this.textBuilder.append("|||-"+card).append("\n");
			}
		}
		
		synchronized (zone) {
			this.textBuilder.append("||-Zone\n");
			this.textBuilder.append("|||- Health: " + zone.getZoneHealth()).append("\n");
			this.textBuilder.append("|||- Capacity: " + zone.getCapacity()).append("\n");
			this.debugZoneCoordinates(zone);
			this.debugZoneCombatants(zone);
		}
	}
	
	private void debugZoneCoordinates(Zone zone) {
		int maxHorizontalDimension = zone.getMaxHorizontalDimension();
		
		this.textBuilder.append("|||- Graph:\n");
		for (int rowIndex = zone.getVerticalDimension() - 1; rowIndex >= 0; rowIndex--) {
			int horizontalSize = zone.getHorizontalDimension(rowIndex);
			int spaceCount = (int)((maxHorizontalDimension - horizontalSize)/2) * 3;
			this.textBuilder.append("|||  " + " ".repeat(spaceCount));
			for (int columnIndex = zone.getHorizontalDimension(rowIndex) - 1; columnIndex >= 0; columnIndex--) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				if (zone.hasCombatant(coordinate)) {
					this.textBuilder.append("[+]");
				} else {
					this.textBuilder.append("[ ]");
				}
			}
			this.textBuilder.append("\n");		
		}
	}
	
	private void debugZoneCombatants(Zone zone) {
		this.textBuilder.append("|||- Combatants:\n");
		for (int rowIndex = zone.getVerticalDimension() - 1; rowIndex >= 0; rowIndex--) {
			for (int columnIndex = zone.getHorizontalDimension(rowIndex) - 1; columnIndex >= 0; columnIndex--) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				if (zone.hasCombatant(coordinate)) {
					this.textBuilder.append("|||  "+coordinate+zone.getCombatant(coordinate)).append("\n");
				}
			}		
		}
	}
}
