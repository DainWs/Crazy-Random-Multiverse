package com.dainws.games.crm.domain.core.card;

public class Cooldown {

	private final int duration;
    private int remainingTime;
    private boolean active;

    public Cooldown(int duration) {
        this.duration = duration;
        this.remainingTime = duration;
        this.active = false;
    }

    public void activate() {
    	if (!this.active) {
	    	this.remainingTime = this.duration;
	    	this.active = true;
    	}
    }

    public void update() {
    	this.remainingTime--;

    	if (this.isReady()) {
    		this.active = false;
    	}
    }

    public boolean isReady() {
        return this.remainingTime <= 0;
    }

    public int getTimeRemaining() {
        return this.remainingTime;
    }
}
