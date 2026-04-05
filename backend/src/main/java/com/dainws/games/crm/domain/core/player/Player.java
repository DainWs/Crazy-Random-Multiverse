package com.dainws.games.crm.domain.core.player;

import java.util.Objects;

public abstract class Player {

	private PlayerCode playerCode;
	private String name;
	private Hand hand;
	private boolean isAlive;
	private boolean isSpectator;

	protected Player(PlayerCode code, String name) {
		this.playerCode = code;
		this.name = name;
		this.hand = new Hand();
		this.isAlive = true;
		this.isSpectator = false;
	}

	public void die() {
		this.isAlive = false;
	}

	public boolean isAlive() {
		return this.isAlive;
	}

	public boolean isDeath() {
		return !this.isAlive;
	}

	public void changeToSpectator() {
		this.isSpectator = true;
	}

	public boolean isSpectator() {
		return this.isSpectator;
	}

	public boolean isNotSpectator() {
		return !this.isSpectator;
	}

	public PlayerCode getPlayerCode() {
		return this.playerCode;
	}

	public boolean isCode(PlayerCode code) {
		return this.playerCode.equals(code);
	}

	public String getCode() {
		return this.playerCode.getCode();
	}

	public String getName() {
		return name;
	}

	public Hand getHand() {
		return hand;
	}

	public void setHand(Hand hand) {
		this.hand = hand;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj == null || obj.getClass() != this.getClass()) {
			return false;
		}

		Player that = (Player) obj;
		return this.playerCode.equals(that.playerCode);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.playerCode);
	}
}
