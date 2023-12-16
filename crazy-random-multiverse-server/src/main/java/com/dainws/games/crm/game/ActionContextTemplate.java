package com.dainws.games.crm.game;

import com.dainws.games.cbg.domain.GameCode;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.player.PlayerCode;
import com.dainws.games.cbg.domain.player.Position;

public class ActionContextTemplate {
	private GameCode gameCode;

	private PlayerCode sourcePlayerCode;
	private CardCode sourceCardCode;
	private Position sourcePosition;

	private PlayerCode targetPlayerCode;
	private CardCode targetCardCode;
	private Position targetPosition;

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

	public Position getSourcePosition() {
		return sourcePosition;
	}

	public void setSourcePosition(Position sourcePosition) {
		this.sourcePosition = sourcePosition;
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

	public Position getTargetPosition() {
		return targetPosition;
	}

	public void setTargetPosition(Position targetPosition) {
		this.targetPosition = targetPosition;
	}
}
