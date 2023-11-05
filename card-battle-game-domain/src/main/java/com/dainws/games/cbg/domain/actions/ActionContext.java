package com.dainws.games.cbg.domain.actions;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.Player;
import com.dainws.games.cbg.domain.Position;
import com.dainws.games.cbg.domain.card.CardCode;

public class ActionContext {

	private Game game;
	private Player sourcePlayer;
	private CardCode sourceCardCode;
	private Position sourcePosition;
	private Player targetPlayer;
	private CardCode targetCardCode;
	private Position targetPosition;
	
	public void setGame(Game game) {
		this.game = game;
	}
	
	public Game getGame() {
		return game;
	}
	
	public void setSourcePlayer(Player sourcePlayer) {
		this.sourcePlayer = sourcePlayer;
	}
	
	public Player getSourcePlayer() {
		return sourcePlayer;
	}
	
	public void setSourceCardCode(CardCode sourceCardCode) {
		this.sourceCardCode = sourceCardCode;
	}
	
	public CardCode getSourceCardCode() {
		return sourceCardCode;
	}
	
	public void setSourcePosition(Position sourcePosition) {
		this.sourcePosition = sourcePosition;
	}
	
	public Position getSourcePosition() {
		return sourcePosition;
	}

	public Player getTargetPlayer() {
		return targetPlayer;
	}

	public void setTargetPlayer(Player targetPlayer) {
		this.targetPlayer = targetPlayer;
	}

	public CardCode getTargetCardCode() {
		return targetCardCode;
	}

	public void setTargetCardCode(CardCode targetCardCode) {
		this.targetCardCode = targetCardCode;
	}

	public Position getTargetPosition() {
		return targetPosition;
	}

	public void setTargetPosition(Position targetPosition) {
		this.targetPosition = targetPosition;
	}

}
