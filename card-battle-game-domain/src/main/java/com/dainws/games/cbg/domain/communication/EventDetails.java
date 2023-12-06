package com.dainws.games.cbg.domain.communication;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;

public class EventDetails {
	private Game game;
	
	private Player sourcePlayer;
	private Card sourceCard;
	private Position sourcePosition;

	private Player targetPlayer;
	private Card targetCard;
	private Position targetPosition;
	
	public Game getGame() {
		return game;
	}
	
	public void setGame(Game game) {
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

	public boolean hasSourcePosition() {
		return this.sourcePosition != null;
	}
	
	public Position getSourcePosition() {
		return sourcePosition;
	}

	public void setSourcePosition(Position sourcePosition) {
		this.sourcePosition = sourcePosition;
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

	public boolean hasTargetPosition() {
		return this.targetPosition != null;
	}
	
	public Position getTargetPosition() {
		return targetPosition;
	}

	public void setTargetPosition(Position targetPosition) {
		this.targetPosition = targetPosition;
	}
}
