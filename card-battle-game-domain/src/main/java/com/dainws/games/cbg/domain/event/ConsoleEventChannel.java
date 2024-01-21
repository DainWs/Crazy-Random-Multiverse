package com.dainws.games.cbg.domain.event;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.util.List;

import com.dainws.games.cbg.domain.player.Player;

public class ConsoleEventChannel implements EventChannel {

	private Logger logger;

	public ConsoleEventChannel() {
		this.logger = System.getLogger("EventChannel");
	}

	@Override
	public void send(List<Player> to, Event event) {
		String eventDescription = this.getFormatted(event.getCode());
		this.logger.log(Level.INFO, eventDescription);
	}

	@Override
	public void send(Player to, Event event) {
		String eventDescription = this.getFormatted(event.getCode());
		this.logger.log(Level.INFO, eventDescription);
	}

	private String getFormatted(EventCode eventCode) {
		return "Evento %s enviado".formatted(eventCode);
	}
}
