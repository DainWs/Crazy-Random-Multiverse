package com.dainws.games.cbg.domain.communication;

import java.util.List;
import java.util.stream.Collectors;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.action.ActionContext;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;

public class PlayerEventListener {

	private Channel channel;

	public PlayerEventListener() {
		this.channel = new ConsoleChannel();
	}

	public void onPlayerGetTurn(Game game, Player player) {
		EventDetails details = new EventDetails();
		details.setTargetPlayer(player);

		Event event = new Event(EventCode.PLAYER_GET_TURN, details);
		this.notifyEventToPlayers(game.getPlayers(), event);
	}

	public void onPlayerGetCard(Game game, Player player, Card card) {
		EventDetails details = new EventDetails();
		details.setTargetPlayer(player);
		Event event = new Event(EventCode.PLAYER_GET_CARD, details);
		
		EventDetails detailsWithCard = new EventDetails();
		detailsWithCard.setTargetPlayer(player);
		detailsWithCard.setTargetCard(card);
		Event eventWithCard = new Event(EventCode.PLAYER_GET_CARD, detailsWithCard);

		List<Player> othersPlayers = game.getPlayers().stream()
				.filter(p -> !p.equals(player))
				.collect(Collectors.toList());
		this.notifyEventToPlayers(othersPlayers, event);
		this.notifyEventToPlayer(player, eventWithCard);
	}

	public void onPlayerPutCardAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_PUT_CARD, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}

	public void onPlayerMoveCardAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_MOVE_CARD, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}

	public void onPlayerAttackCardAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_ATTACK_CARD, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}

	public void onPlayerEquipCardAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_EQUIP_CARD, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}

	public void onPlayerUseSpellAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_USE_SPELL, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}

	public void onPlayerPassTurnAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_PASS_TURN, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}

	public void onPlayerSurrenderAction(ActionContext context) {
		Event event = this.createEventFrom(EventCode.PLAYER_SURRENDER, context);
		this.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}
	

	private void notifyEventToPlayers(List<Player> players, Event event) {
		for (Player player : players) {
			this.notifyEventToPlayer(player, event);
		}
	}

	private void notifyEventToPlayer(Player player, Event event) {
		this.channel.send(Destination.of(player), event);
	}
	
	private Event createEventFrom(EventCode code, ActionContext context) {
		EventDetails eventDetails = new EventDetails();
		eventDetails.setSourcePlayer(context.getSourcePlayer());
		eventDetails.setSourceCard(context.getSourceCard());
		eventDetails.setSourcePosition(context.getSourcePosition());
		eventDetails.setTargetPlayer(context.getTargetPlayer());
		eventDetails.setTargetCard(context.getTargetCard());
		eventDetails.setTargetPosition(context.getTargetPosition());
		return new Event(code, eventDetails);
	}

	public void setCommunicationChannel(Channel channel) {
		this.channel = channel;
	}
}
