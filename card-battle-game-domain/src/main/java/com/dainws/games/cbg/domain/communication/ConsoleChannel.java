package com.dainws.games.cbg.domain.communication;

public class ConsoleChannel implements Channel {

	private String errorMessage;
	private String eventMessage;

	public ConsoleChannel() {
		this.errorMessage = "Cliente %s recibe el error %s";
		this.eventMessage = "Cliente %s recibe el evento %s";
	}

	@Override
	public void send(Destination destination, Error error) {
		System.out.println(this.errorMessage.formatted(destination, error.getText()));
	}

	@Override
	public void send(Destination destination, Event event) {
		System.out.println(this.eventMessage.formatted(destination, event.getCode()));
	}
}
