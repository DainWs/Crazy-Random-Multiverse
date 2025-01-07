package com.dainws.games.crm.domain.log;

public interface Logger {

	void error(String message, Object... arguments);

	void warn(String message, Object... arguments);

	void info(String message, Object... arguments);

	void debug(String message, Object... arguments);

	void trace(String message, Object... arguments);

	static Logger getLogger(Class<?> clazz) {
		return new ConsoleLogger(clazz);
	}
}
