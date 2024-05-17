package com.dainws.games.crm.persistence;

import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.action.ActionContext;
import com.dainws.games.crm.domain.models.board.Board;
import com.dainws.games.crm.domain.models.board.Coordinate;
import com.dainws.games.crm.domain.models.board.Zone;
import com.dainws.games.crm.domain.models.card.Card;
import com.dainws.games.crm.domain.models.player.Player;

class JPAActionContext implements ActionContext {
	private Game game;

	private Player sourcePlayer;
	private Coordinate sourceCoordinate;
	private Card sourceCard;

	private Player targetPlayer;
	private Coordinate targetCoordinate;
	private Card targetCard;

	public JPAActionContext() {}
	
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
		return board.getZone(this.sourcePlayer.getPlayerCode());
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
		return board.getZone(this.targetPlayer.getPlayerCode());
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