package com.dainws.games.cbg.domain;

import java.util.Objects;

public class Player {

	private PlayerCode playerCode;
	private String name;
	private Hand hand;
	private Zone zone;
	
	private Player(Builder builder) {
		this.playerCode = builder.playerCode;
		this.name = builder.name;
		this.hand = builder.hand;
		this.zone = builder.zone;
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

	public void setHand(Hand hand) {
		this.hand = hand;
	}

	public Zone getZone() {
		return zone;
	}

	public void setZone(Zone zone) {
		this.zone = zone;
	}
	
	public boolean isAlive() {
		return this.zone.hasCombatant(Position.LEADER_POSITION);
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || obj.getClass() != this.getClass())
			return false;

		Player that = (Player) obj;
		return this.playerCode.equals(that.playerCode);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.playerCode);
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private PlayerCode playerCode;
		private String name;
		private Hand hand;
		private Zone zone;

		private Builder() {}

		public Builder withPlayerCode(String code) {
			this.playerCode = PlayerCode.newInstance(code);
			return this;
		}

		public Builder withPlayerCode(PlayerCode playerCode) {
			this.playerCode = playerCode;
			return this;
		}

		public Builder withName(String name) {
			this.name = name;
			return this;
		}

		public Builder withHand(Hand hand) {
			this.hand = hand;
			return this;
		}

		public Builder withZone(Zone zone) {
			this.zone = zone;
			return this;
		}

		public Player build() {
			Objects.requireNonNull(this.playerCode);
			Objects.requireNonNull(this.name);

			if (this.hand == null) {
				this.hand = new Hand();
			}

			if (this.zone == null) {
				this.zone = new Zone();
			}
			return new Player(this);
		}
	}
}
