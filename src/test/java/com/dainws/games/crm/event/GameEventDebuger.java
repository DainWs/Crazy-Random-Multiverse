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
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

@Component
@ActiveProfiles({ "debug" })
public class GameEventDebuger implements ApplicationListener<PayloadApplicationEvent<Event>> {

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

	private void debugGame(EventCode code, Game game) {
		System.out.println("-".repeat(100));
		System.out.println("Event code: " + code);
		System.out.println("Game code: " + game.getCode());
		System.out.println("Game mode: " + game.getMode());
		System.out.println("Game round: " + game.getRound());
		System.out.println("Game turn: " + game.getTurn());
		System.out.println("Game alive players: " + game.getAlivePlayers().size());
		for (Player player : game.getAlivePlayers()) {
			System.out.println("|_ ");
			System.out.println("||-" + player.getName());
			this.debugPlayer(player, game.getBoard().getZoneOf(player));
		}
		System.out.println("Game death players: " + game.getDeathPlayers().size());
		for (Player player : game.getDeathPlayers()) {
			System.out.println(" - " + player.getName());
			this.debugPlayer(player, game.getBoard().getZoneOf(player));
		}
	}
	
	private void debugPlayer(Player player, Zone zone) {
		System.out.println("||-Hand");
		Hand hand = player.getHand();
		for (Card card : hand.getCards()) {
			System.out.println("|||-"+card);
		}
		System.out.println("||-Zone");
		System.out.println("|||- Health: " + zone.getZoneHealth());
		System.out.println("|||- Capacity: " + zone.getCapacity());
		this.debugZoneCoordinates(zone);
		this.debugZoneCombatants(zone);
	}
	
	private void debugZoneCoordinates(Zone zone) {
		int maxHorizontalDimension = zone.getMaxHorizontalDimension();
		
		System.out.println("|||- Graph:");
		for (int rowIndex = zone.getVerticalDimension() - 1; rowIndex >= 0; rowIndex--) {
			int horizontalSize = zone.getHorizontalDimension(rowIndex);
			int spaceCount = (int)((maxHorizontalDimension - horizontalSize)/2) * 3;
			System.out.print("|||  " + " ".repeat(spaceCount));
			for (int columnIndex = zone.getHorizontalDimension(rowIndex) - 1; columnIndex >= 0; columnIndex--) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				if (zone.hasCombatant(coordinate)) {
					System.out.print("[+]");
				} else {
					System.out.print("[ ]");
				}
			}
			System.out.println();		
		}
	}
	
	private void debugZoneCombatants(Zone zone) {
		System.out.println("|||- Combatants:");
		for (int rowIndex = zone.getVerticalDimension() - 1; rowIndex >= 0; rowIndex--) {
			for (int columnIndex = zone.getHorizontalDimension(rowIndex) - 1; columnIndex >= 0; columnIndex--) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				if (zone.hasCombatant(coordinate)) {
					System.out.println("|||  "+coordinate+zone.getCombatant(coordinate));
				}
			}		
		}
	}
}
