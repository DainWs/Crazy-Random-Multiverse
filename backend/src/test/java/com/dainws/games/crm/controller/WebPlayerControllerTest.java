package com.dainws.games.crm.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.action.ActionResult;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.usecase.PlayerUsecase;
import com.dainws.games.crm.usecase.RecordingPlayerActionFacade;

class WebPlayerControllerTest {

	private static final String ACTION_URL = "/game/{gameCode}/action";
	private static final String USER_CODE = "user-1";

	private RecordingPlayerActionFacade facade;
	private MemoryGameRepository gameRepository;
	private MockMvc mockMvc;

	@BeforeEach
	void beforeEach() {
		this.facade = new RecordingPlayerActionFacade();
		this.gameRepository = new MemoryGameRepository();
		WebPlayerController controller = new WebPlayerController(new PlayerUsecase(this.facade, this.gameRepository));
		controller.setUserSession(new User(USER_CODE, "name", UserPlatform.WEB));
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller) //
				.setControllerAdvice(new RestExceptionAdvice()) //
				.build();
	}

	@Test
	void testGivenActionWithoutType_whenDispatchAction_thenRequestIsRejected() throws Exception {
		GameCode gameCode = new GameCode();
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"%s\"}".formatted(gameCode.text(), USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, this.encode(gameCode)) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(status().isBadRequest());
	}

	@Test
	void testGivenActionWithoutType_whenDispatchAction_thenNothingIsPerformed() throws Exception {
		GameCode gameCode = new GameCode();
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"%s\"}".formatted(gameCode.text(), USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, this.encode(gameCode)) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body));

		assertTrue(this.facade.getPerformedActions().isEmpty());
	}

	@Test
	void testGivenActionWithoutType_whenDispatchAction_thenBodyCarriesTheMalformedKey() throws Exception {
		GameCode gameCode = new GameCode();
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"%s\"}".formatted(gameCode.text(), USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, this.encode(gameCode)) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(jsonPath("$.key").value("exception.request.malformed"));
	}

	@Test
	void testGivenActionWithoutGame_whenDispatchAction_thenBodyCarriesTheMalformedKey() throws Exception {
		String body = "{\"sourcePlayer\":\"%s\",\"type\":\"PASS_TURN\"}".formatted(USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, this.encode(new GameCode())) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.request.malformed"));
	}

	@Test
	void testGivenActionWithoutSourcePlayer_whenDispatchAction_thenBodyCarriesTheMalformedKey() throws Exception {
		GameCode gameCode = new GameCode();
		String body = "{\"game\":\"%s\",\"type\":\"PASS_TURN\"}".formatted(gameCode.text());

		this.mockMvc.perform(post(ACTION_URL, this.encode(gameCode)) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.request.malformed"));
	}

	@Test
	void testGivenActionOfAnotherPlayer_whenDispatchAction_thenBodyCarriesTheIdentityMismatchKey() throws Exception {
		GameCode gameCode = new GameCode();
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"other-user\",\"type\":\"PASS_TURN\"}".formatted(gameCode.text());

		this.mockMvc.perform(post(ACTION_URL, this.encode(gameCode)) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.access_denied.identity_mismatch"));
	}

	@Test
	void testGivenActionOfAnotherGame_whenDispatchAction_thenBodyCarriesTheMalformedKey() throws Exception {
		GameCode otherGameCode = new GameCode();
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"%s\",\"type\":\"PASS_TURN\"}".formatted(otherGameCode.text(), USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, this.encode(new GameCode())) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.request.malformed"));
	}

	@Test
	void testGivenGameCodeThatIsNotBase64_whenDispatchAction_thenBodyCarriesTheMalformedKey() throws Exception {
		String body = "{\"game\":\"x\",\"sourcePlayer\":\"%s\",\"type\":\"PASS_TURN\"}".formatted(USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, "***") //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(jsonPath("$.key").value("exception.request.malformed"));
	}

	@Test
	void testGivenRejectedAction_whenDispatchAction_thenResponseIsBadRequest() throws Exception {
		this.facade.setResult(ActionResult.failed(new PlayerActionExceptionCode(Code.ALLOWED_ONLY_ON_TURN)));

		this.mockMvc.perform(this.passTurnRequest()) //
				.andExpect(status().isBadRequest());
	}

	@Test
	void testGivenRejectedAction_whenDispatchAction_thenBodyCarriesTheExceptionKey() throws Exception {
		this.facade.setResult(ActionResult.failed(new PlayerActionExceptionCode(Code.ALLOWED_ONLY_ON_TURN)));

		this.mockMvc.perform(this.passTurnRequest()) //
				.andExpect(jsonPath("$.key").value(new PlayerActionExceptionCode(Code.ALLOWED_ONLY_ON_TURN).value()));
	}

	@Test
	void testGivenAcceptedAction_whenDispatchAction_thenResponseIsOk() throws Exception {
		this.mockMvc.perform(this.passTurnRequest()) //
				.andExpect(status().isOk());
	}

	@Test
	void testGivenUserOutsideTheGame_whenDispatchAction_thenBodyCarriesTheWrongGameKey() throws Exception {
		Game game = new GameBuilder().withPlayers(new PlayerBuilder().withCode("other-user").build()).build();
		this.gameRepository.save(game);
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"%s\",\"type\":\"PASS_TURN\"}".formatted(game.getCode().text(), USER_CODE);

		this.mockMvc.perform(post(ACTION_URL, this.encode(game.getCode())) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body)) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.access_denied.wrong_game"));
	}

	private MockHttpServletRequestBuilder passTurnRequest() {
		Game game = new GameBuilder().withPlayers(new PlayerBuilder().withCode(USER_CODE).build()).build();
		this.gameRepository.save(game);
		GameCode gameCode = game.getCode();
		String body = "{\"game\":\"%s\",\"sourcePlayer\":\"%s\",\"type\":\"PASS_TURN\"}".formatted(gameCode.text(), USER_CODE);

		return post(ACTION_URL, this.encode(gameCode)) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(body);
	}

	private String encode(GameCode gameCode) {
		byte[] bytes = gameCode.text().getBytes(StandardCharsets.UTF_8);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}
}
