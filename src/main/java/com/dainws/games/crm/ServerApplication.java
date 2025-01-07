package com.dainws.games.crm;

import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		configureJulLogger();

		SpringApplication.run(ServerApplication.class, args);
	}
	
	public static void configureJulLogger() {
        Logger rootLogger = Logger.getLogger("");
        for (var handler : rootLogger.getHandlers()) {
            rootLogger.removeHandler(handler);
        }

        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setFormatter(new JulToSpringFormatter());
        consoleHandler.setLevel(Level.ALL);

        rootLogger.addHandler(consoleHandler);
        rootLogger.setLevel(Level.ALL);
    }
}
