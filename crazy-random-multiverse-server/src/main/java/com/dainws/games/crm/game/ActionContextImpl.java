package com.dainws.games.crm.game;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.action.ActionContext;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;

class ActionContextImpl implements ActionContext {
	private Game game;

	private Player sourcePlayer;
	private Position sourcePosition;
	private Card sourceCard;

	private Player targetPlayer;
	private Position targetPosition;
	private Card targetCard;

	public ActionContextImpl() {}
	
	public void setGame(Game game) {
		this.game = game;
	}

	@Override
	public Game getGame() {
		return game;
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
		return this.sourcePlayer.getZone();
	}

	public void setSourceCard(Card sourceCard) {
		this.sourceCard = sourceCard;
	}

	@Override
	public Card getSourceCard() {
		return this.sourceCard;
	}

	public void setSourcePosition(Position sourcePosition) {
		this.sourcePosition = sourcePosition;
	}

	@Override
	public Position getSourcePosition() {
		return sourcePosition;
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
		return this.targetPlayer.getZone();
	}

	public void setTargetCard(Card targetCard) {
		this.targetCard = targetCard;
	}

	@Override
	public Card getTargetCard() {
		return targetCard;
	}

	public void setTargetPosition(Position targetPosition) {
		this.targetPosition = targetPosition;
	}

	@Override
	public Position getTargetPosition() {
		return targetPosition;
	}
}
