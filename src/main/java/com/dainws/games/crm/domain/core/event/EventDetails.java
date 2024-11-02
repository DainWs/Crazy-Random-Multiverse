package com.dainws.games.crm.domain.core.event;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Player;

public class EventDetails {
	private Game game;

	private Player sourcePlayer;
	private Card sourceCard;
	private Coordinate sourceCoordinate;

	private Player targetPlayer;
	private Card targetCard;
	private Coordinate targetCoordinate;

	public EventDetails(Game game) {
		this.game = game;
	}

	public Game getGame() {
		return game;
	}

	public GameCode getGameCode() {
		return game.getCode();
	}

	public void setGameContext(Game game) {
		this.game = game;
	}

	public boolean hasSourcePlayer() {
		return this.sourcePlayer != null;
	}

	public Player getSourcePlayer() {
		return sourcePlayer;
	}

	public void setSourcePlayer(Player sourcePlayer) {
		this.sourcePlayer = sourcePlayer;
	}

	public boolean hasSourceCard() {
		return this.sourceCard != null;
	}

	public Card getSourceCard() {
		return sourceCard;
	}

	public void setSourceCard(Card sourceCard) {
		this.sourceCard = sourceCard;
	}

	public boolean hasSourceCoordinate() {
		return this.sourceCoordinate != null;
	}

	public Coordinate getSourceCoordinate() {
		return sourceCoordinate;
	}

	public void setSourceCoordinate(Coordinate sourceCoordinate) {
		this.sourceCoordinate = sourceCoordinate;
	}

	public boolean hasTargetPlayer() {
		return this.targetPlayer != null;
	}

	public Player getTargetPlayer() {
		return targetPlayer;
	}

	public void setTargetPlayer(Player targetPlayer) {
		this.targetPlayer = targetPlayer;
	}

	public boolean hasTargetCard() {
		return this.targetCard != null;
	}

	public Card getTargetCard() {
		return targetCard;
	}

	public void setTargetCard(Card targetCard) {
		this.targetCard = targetCard;
	}

	public boolean hasTargetCoordinate() {
		return this.targetCoordinate != null;
	}

	public Coordinate getTargetCoordinate() {
		return targetCoordinate;
	}

	public void setTargetCoordinate(Coordinate targetCoordinate) {
		this.targetCoordinate = targetCoordinate;
	}
}
