package com.dainws.games.crm.domain.core.exception;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;

public class ExceptionMonitor implements ExceptionPublisher {

	private ExceptionPublisher wrapper;
	private List<ExceptionCode> handledErrors;

	public ExceptionMonitor() {
		this.wrapper = ExceptionPublisher.NONE;
		this.handledErrors = new ArrayList<>();
	}

	@Override
	public void publish(List<Player> to, ExceptionCode exceptionCode) {
		if (!this.handledErrors.contains(exceptionCode)) {
			this.handledErrors.add(exceptionCode);
		}
		this.wrapper.publish(to, exceptionCode);
	}

	@Override
	public void publish(Player to, ExceptionCode exceptionCode) {
		if (!this.handledErrors.contains(exceptionCode)) {
			this.handledErrors.add(exceptionCode);
		}
		this.wrapper.publish(to, exceptionCode);
	}
	
	public List<ExceptionCode> getHandledErrors() {
		return this.handledErrors;
	}
	
	public int countHandledErrors() {
		return this.handledErrors.size();
	}
	
	public void setWrapper(ExceptionPublisher wrapper) {
		this.wrapper = wrapper;
	}
}
