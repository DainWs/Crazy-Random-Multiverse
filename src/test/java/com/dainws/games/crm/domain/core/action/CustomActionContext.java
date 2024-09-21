package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Player;

public class CustomActionContext implements ActionContext {
	private Game game;

	private Player sourcePlayer;
	private Coordinate sourceCoordinate;
	private Card sourceCard;

	private Player targetPlayer;
	private Coordinate targetCoordinate;
	private Card targetCard;

	public CustomActionContext() {
		
	}
	
	public void setGame(Game game) {
		this.game = game;
	}

	@Override
	public Game getGame() {
		return game;
	}
	
	@Override
	public Board getBoard() {
		return this.game.getBoard();
	}

	public void setSourcePlayer(Player sourcePlayer) {
		this.sourcePlayer = sourcePlayer;
	}

	@Override
	public Player getSourcePlayer() {
		return sourcePlayer;
	}

	@Override
	public Zone getSourceZone() {
		Board board = this.getBoard();
		return board.getZoneOf(this.sourcePlayer.getPlayerCode());
	}

	public void setSourceCard(Card sourceCard) {
		this.sourceCard = sourceCard;
	}

	@Override
	public Card getSourceCard() {
		return this.sourceCard;
	}

	public void setSourceCoordinate(Coordinate sourceCoordinate) {
		this.sourceCoordinate = sourceCoordinate;
	}

	@Override
	public Coordinate getSourceCoordinate() {
		return sourceCoordinate;
	}

	public void setTargetPlayer(Player targetPlayer) {
		this.targetPlayer = targetPlayer;
	}

	@Override
	public Player getTargetPlayer() {
		return targetPlayer;
	}

	@Override
	public Zone getTargetZone() {
		Board board = this.getBoard();
		return board.getZoneOf(this.targetPlayer.getPlayerCode());
	}

	public void setTargetCard(Card targetCard) {
		this.targetCard = targetCard;
	}

	@Override
	public Card getTargetCard() {
		return targetCard;
	}

	public void setTargetCoordinate(Coordinate targetCoordinate) {
		this.targetCoordinate = targetCoordinate;
	}

	@Override
	public Coordinate getTargetCoordinate() {
		return targetCoordinate;
	}
}
