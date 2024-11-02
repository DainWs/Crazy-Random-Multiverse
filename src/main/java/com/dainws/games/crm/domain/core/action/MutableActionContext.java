package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.GameExceptionHandler;
import com.dainws.games.crm.domain.core.player.Player;

public class MutableActionContext implements ActionContext {
	private Game game;
	private EventPublisher eventPublisher;
	private GameExceptionHandler exceptionHandler;

	private Player sourcePlayer;
	private Coordinate sourceCoordinate;
	private Card sourceCard;

	private Player targetPlayer;
	private Coordinate targetCoordinate;
	private Card targetCard;

	public MutableActionContext() {
	}

	public void setGame(Game game) {
		this.game = game;
	}

	@Override
	public Game getGame() {
		return game;
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	@Override
	public EventPublisher getEventPublisher() {
		return this.eventPublisher;
	}
	
	public void setGameExceptionHandler(GameExceptionHandler exceptionHandler) {
		this.exceptionHandler = exceptionHandler;
	}
	
	@Override
	public GameExceptionHandler getGameExceptionHandler() {
		return this.exceptionHandler;
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
