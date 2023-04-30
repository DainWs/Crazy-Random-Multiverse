package com.dainws.monkeys_with_minigun.crm_game.classic;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class ClassicGame {
	private static final Logger LOGGER = Logger.getLogger(ClassicGame.class.getName());
	
	private enum Arguments {
		LEADERS_PROVIDER("--LeadersProvider:([^\s]+)"),
		
		
	}
	
	public ClassicGame() {
		System.out.println(System.getProperty("user.dir"));
	}
	
	
	public static void main(String[] args) {
		run(args);
	}
	
	public static void run(String[] args) {
		List<String> arguments = new ArrayList<>();
		for (String argument : args) {
			
		}
		
		SpringApplication.run(ClassicGame.class, arguments);
	}
}
