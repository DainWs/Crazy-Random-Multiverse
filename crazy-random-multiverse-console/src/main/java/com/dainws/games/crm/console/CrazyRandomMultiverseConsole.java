package com.dainws.games.crm.console;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.crm.console.controllers.Console;
import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.domain.models.PartyCode;
import com.dainws.games.crm.console.domain.models.User;
import com.dainws.games.crm.console.domain.models.exceptions.PartyException;
import com.dainws.games.crm.console.services.GameServiceFacade;
import com.dainws.games.crm.console.services.PartyService;

@SpringBootApplication
public class CrazyRandomMultiverseConsole implements CommandLineRunner {
	private static final Logger LOG = LoggerFactory.getLogger(CrazyRandomMultiverseConsole.class);
	
	@Autowired
	private Console console;
	
	@Autowired
	private PartyService partyService;
	
	@Autowired
	private GameServiceFacade gameService;

	@Override
	public void run(String... args) throws Exception {
		String username = this.console.ask("Player name: ");
		User user = new User(username);
		
		String[] options = {
		  "Jugar contra la IA" 
		};

		int selectedOption = this.console.select(options);
		if (selectedOption == 0) {
			this.playVsIA(user);
		}
	}
	
	private void playVsIA(User user) throws PartyException {
		PartyCode partyCode = this.partyService.create(user);
		this.partyService.join(partyCode, new User("IA"));
		Party party = this.partyService.getParty(partyCode);
		
		Game game = this.gameService.createGame(party);
		this.gameService.startGame(game);
	}

	public static void main(String[] args) {
		SpringApplication.run(CrazyRandomMultiverseConsole.class, args);
	}
}
