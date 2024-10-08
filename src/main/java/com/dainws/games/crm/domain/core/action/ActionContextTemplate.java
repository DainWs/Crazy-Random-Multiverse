package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;

// TODO tal vez no deberia estar aqui
public class ActionContextTemplate {
	private GameCode gameCode;

	private PlayerCode sourcePlayerCode;
	private CardCode sourceCardCode;
	private Coordinate sourceCoordinate;

	private PlayerCode targetPlayerCode;
	private CardCode targetCardCode;
	private Coordinate targetCoordinate;

	public GameCode getGameCode() {
		return gameCode;
	}

	public void setGameCode(GameCode gameCode) {
		this.gameCode = gameCode;
	}

	public boolean isSourcePlayerRequired() {
		return this.sourcePlayerCode != null;
	}

	public PlayerCode getSourcePlayerCode() {
		return sourcePlayerCode;
	}

	public void setSourcePlayerCode(PlayerCode sourcePlayerCode) {
		this.sourcePlayerCode = sourcePlayerCode;
	}

	public CardCode getSourceCardCode() {
		return sourceCardCode;
	}

	public void setSourceCardCode(CardCode sourceCardCode) {
		this.sourceCardCode = sourceCardCode;
	}

	public Coordinate getSourceCoordinate() {
		return sourceCoordinate;
	}

	public void setSourceCoordinate(Coordinate sourceCoordinate) {
		this.sourceCoordinate = sourceCoordinate;
	}

	public boolean isTargetPlayerRequired() {
		return this.targetPlayerCode != null;
	}

	public PlayerCode getTargetPlayerCode() {
		return targetPlayerCode;
	}

	public void setTargetPlayerCode(PlayerCode targetPlayerCode) {
		this.targetPlayerCode = targetPlayerCode;
	}

	public CardCode getTargetCardCode() {
		return targetCardCode;
	}

	public void setTargetCardCode(CardCode targetCardCode) {
		this.targetCardCode = targetCardCode;
	}

	public Coordinate getTargetCoordinate() {
		return targetCoordinate;
	}

	public void setTargetCoordinate(Coordinate targetCoordinate) {
		this.targetCoordinate = targetCoordinate;
	}
}
