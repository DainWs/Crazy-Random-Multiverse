package com.dainws.games.crm.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.services.ResourceService;

class WebResourceControllerTest {

	private static final String RESOURCES_URL = "/game/{gameCode}/resources";
	private static final String USER_CODE = "user-1";

	private Game game;
	private MockMvc mockMvc;

	@BeforeEach
	void beforeEach() {
		MemoryCardRepository cardRepository = new MemoryCardRepository();
		cardRepository.set(new Leader(0));
		cardRepository.set(Warrior.rareWarriorBuilder() //
				.withCode(4) //
				.withNoneArmor() //
				.withPhysicalDamage(5) //
				.withHealth(5) //
				.build());

		this.game = new GameBuilder().withPlayers(new PlayerBuilder().withCode(USER_CODE).build()).build();
		MemoryGameRepository gameRepository = new MemoryGameRepository();
		gameRepository.save(this.game);

		WebResourceController controller = new WebResourceController(new ResourceService(gameRepository, cardRepository));
		controller.setUserSession(new User(USER_CODE, "name", UserPlatform.WEB));
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller) //
				.setControllerAdvice(new RestExceptionAdvice()) //
				.build();
	}

	@Test
	void testGivenPlayerOfTheGame_whenGetResources_thenResponseIsOk() throws Exception {
		this.mockMvc.perform(get(RESOURCES_URL, this.encode(this.game.getCode()))) //
				.andExpect(status().isOk());
	}

	@Test
	void testGivenPlayerOfTheGame_whenGetResources_thenFixedCarriesTheFirstFixedResource() throws Exception {
		this.mockMvc.perform(get(RESOURCES_URL, this.encode(this.game.getCode()))) //
				.andExpect(jsonPath("$.fixed[0].key").value("icon.damage.physical")) //
				.andExpect(jsonPath("$.fixed[0].type").value("IMAGE")) //
				.andExpect(jsonPath("$.fixed[0].url").value("/resources/icons/damage-physical.png"));
	}

	@Test
	void testGivenPlayerOfTheGame_whenGetResources_thenDynamicCarriesTheAudioTypeAsText() throws Exception {
		this.mockMvc.perform(get(RESOURCES_URL, this.encode(this.game.getCode()))) //
				.andExpect(jsonPath("$.dynamic[?(@.key=='warrior.rare.4.put')].type").value("AUDIO"));
	}

	@Test
	void testGivenGameThatDoesNotExist_whenGetResources_thenBodyCarriesTheNotFoundKey() throws Exception {
		this.mockMvc.perform(get(RESOURCES_URL, this.encode(new GameCode()))) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.game.not_found"));
	}

	@Test
	void testGivenUserOutsideTheGame_whenGetResources_thenBodyCarriesTheAccessDeniedKey() throws Exception {
		Game otherGame = new GameBuilder().withPlayers(new PlayerBuilder().withCode("other-user").build()).build();
		MemoryGameRepository gameRepository = new MemoryGameRepository();
		gameRepository.save(otherGame);
		WebResourceController controller = new WebResourceController(
				new ResourceService(gameRepository, new MemoryCardRepository()));
		controller.setUserSession(new User(USER_CODE, "name", UserPlatform.WEB));
		MockMvc outsiderMvc = MockMvcBuilders.standaloneSetup(controller) //
				.setControllerAdvice(new RestExceptionAdvice()) //
				.build();

		outsiderMvc.perform(get(RESOURCES_URL, this.encode(otherGame.getCode()))) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.access_denied.wrong_game"));
	}

	@Test
	void testGivenGameCodeThatIsNotBase64_whenGetResources_thenBodyCarriesTheMalformedKey() throws Exception {
		this.mockMvc.perform(get(RESOURCES_URL, "***")) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.request.malformed"));
	}

	private String encode(GameCode gameCode) {
		byte[] bytes = gameCode.text().getBytes(StandardCharsets.UTF_8);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}
}
