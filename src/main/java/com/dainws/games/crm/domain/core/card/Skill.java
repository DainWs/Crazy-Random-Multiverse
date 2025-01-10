package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.effect.EffectId;

public class Skill {
	public static final Skill NONE = new Skill(EffectId.NONE, null, 0);

	private EffectId effectId;
	private Cooldown cooldown;
	private int maxUses;
	private int currentUses;

	private Skill(EffectId effectId, Cooldown cooldown, int amountOfUses) {
		this.effectId = effectId;
		this.cooldown = cooldown;
		this.maxUses = amountOfUses;
		this.currentUses = amountOfUses;
	}

	public boolean isPresent() {
		return !this.equals(NONE);
	}

	public boolean isUniqueUseType() {
		return this.cooldown == null;
	}

	public boolean isReusableType() {
		return this.cooldown != null;
	}

	public boolean canBeUsed() {
		boolean hasRemainingUses = this.currentUses > 0;

		if (this.isUniqueUseType()) {
			return hasRemainingUses;
		}

		return hasRemainingUses;
	}

	public void performUse(Game game) {
		this.currentUses--;
		if (this.currentUses <= 0 && this.isReusableType()) {
			this.cooldown.activate();
		}
	}

	public void updateUses() {
		if (this.isReusableType()) {
			this.cooldown.update();

			if (this.cooldown.isReady()) {
				this.currentUses = this.maxUses;
			}
		}
	}

	public EffectId getEffectId() {
		return effectId;
	}
	
	public Cooldown getCooldown() {
		return cooldown;
	}

	public int getCurrentUses() {
		return currentUses;
	}

	public int getMaxUses() {
		return maxUses;
	}

	public static Skill createUniqueUseSkill(EffectId effectId, int amountOfUses) {
		Objects.requireNonNull(effectId);
		return new Skill(effectId, null, amountOfUses);
	}

	public static Skill createReusableSkill(EffectId effectId, Cooldown cooldown, int amountOfUses) {
		Objects.requireNonNull(effectId);
		Objects.requireNonNull(cooldown);
		return new Skill(effectId, cooldown, amountOfUses);
	}
}
