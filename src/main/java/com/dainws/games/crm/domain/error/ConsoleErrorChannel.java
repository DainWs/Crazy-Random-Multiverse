package com.dainws.games.crm.domain.error;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.util.List;

import com.dainws.games.crm.domain.models.player.Player;
import com.dainws.games.crm.domain.translator.Text;

public class ConsoleErrorChannel implements ErrorChannel {
	private Logger logger;

	public ConsoleErrorChannel() {
		this.logger = System.getLogger("ErrorChannel");
	}
	
	@Override
	public void send(List<Player> to, Error error) {
		String errorDescription = this.getFormatted(error.getText());
		this.logger.log(Level.INFO, errorDescription);
	}

	@Override
	public void send(Player to, Error error) {
		String errorDescription = this.getFormatted(error.getText());
		this.logger.log(Level.INFO, errorDescription);
	}
	
	private String getFormatted(Text text) {
		return "[%s] %s".formatted(text.getKey(), text);
	}
}
