package com.dainws.games.crm.domain.models.player;

import java.util.Objects;

public class Player {

	private PlayerCode playerCode;
	private String name;
	private Hand hand;
	private boolean isSpectator;

	public Player(PlayerCode code, String name) {
		this.playerCode = code;
		this.name = name;
		this.hand = new Hand();
		this.isSpectator = false;
	}

	public Player(PlayerCode code, String name, boolean isSpectator) {
		this.playerCode = code;
		this.name = name;
		this.isSpectator = isSpectator;
	}

	public Player(PlayerCode code, String name, Hand hand) {
		this.playerCode = code;
		this.name = name;
		this.hand = hand;
		this.isSpectator = false;
	}

	public PlayerCode getPlayerCode() {
		return this.playerCode;
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

	public boolean isSpectator() {
		return this.isSpectator;
	}
	
	public void die() {
		this.isSpectator = true;
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
