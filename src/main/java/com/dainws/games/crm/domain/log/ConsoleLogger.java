package com.dainws.games.crm.domain.log;

import java.util.logging.Level;

public class ConsoleLogger implements Logger {

	private java.util.logging.Logger logger;
	
	public ConsoleLogger(Class<?> clazz) {
		this.logger = java.util.logging.Logger.getLogger(clazz.getName());
	}
	
	@Override
	public void error(String message, Object... arguments) {
		this.logger.log(Level.SEVERE, message, arguments);
	}

	@Override
	public void warn(String message, Object... arguments) {
		this.logger.log(Level.WARNING, message, arguments);
	}

	@Override
	public void info(String message, Object... arguments) {
		this.logger.log(Level.INFO, message, arguments);
	}

	@Override
	public void debug(String message, Object... arguments) {
		this.logger.log(Level.FINE, message, arguments);
	}

	@Override
	public void trace(String message, Object... arguments) {
		this.logger.log(Level.FINEST, message, arguments);
	}
}
