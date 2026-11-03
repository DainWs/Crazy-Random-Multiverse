package com.dainws.games.crm.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;
import com.dainws.games.crm.services.PartyService;
import com.dainws.games.crm.services.UserService;

class WebUserControllerTest {

	private static final String USER_CODE = "user-1";

	private MemoryUserRepository userRepository;
	private User sessionUser;
	private MockMvc mockMvc;

	@BeforeEach
	void beforeEach() {
		this.userRepository = new MemoryUserRepository();
		this.sessionUser = new User(USER_CODE, "Name", UserPlatform.WEB);

		PartyService partyService = new PartyService(new MemoryPartyRepository());
		WebUserController controller = new WebUserController(new UserService(this.userRepository, partyService));
		controller.setUserSession(this.sessionUser);
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller) //
				.setControllerAdvice(new RestExceptionAdvice()) //
				.build();
	}

	@Test
	void testGivenSessionWithoutUser_whenRegister_thenUserIsCreated() throws Exception {
		this.mockMvc.perform(post("/register"));

		assertThat(this.userRepository.has(this.sessionUser.getCode())).isTrue();
	}

	@Test
	void testGivenSessionWithoutUser_whenRegister_thenResponseCarriesThePublicId() throws Exception {
		this.mockMvc.perform(post("/register")) //
				.andExpect(jsonPath("$.id").value(USER_CODE));
	}

	@Test
	void testGivenRegisteredUserWithAnotherName_whenRegister_thenResponseKeepsTheirName() throws Exception {
		this.userRepository.save(new User(USER_CODE, "Renamed", UserPlatform.WEB));

		this.mockMvc.perform(post("/register")) //
				.andExpect(jsonPath("$.username").value("Renamed"));
	}

	@Test
	void testGivenRegisteredUser_whenGetAccount_thenResponseCarriesTheirName() throws Exception {
		this.userRepository.save(this.sessionUser);

		this.mockMvc.perform(get("/user")) //
				.andExpect(jsonPath("$.username").value("Name"));
	}

	@Test
	void testGivenSessionWhoseUserWasDeleted_whenGetAccount_thenBodyCarriesTheUserNotFoundKey() throws Exception {
		this.mockMvc.perform(get("/user")) //
				.andExpect(status().isBadRequest()) //
				.andExpect(jsonPath("$.key").value("exception.user.not_found"));
	}

	@Test
	void testGivenLoginRequest_whenPerform_thenEndpointDoesNotExist() throws Exception {
		this.mockMvc.perform(post("/login").content("Gamer")) //
				.andExpect(status().isNotFound());
	}
}
