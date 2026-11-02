package com.dainws.games.crm.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.services.PartyOwnerService;

class WebPartyOwnerControllerTest {

	private static final int NEW_MAX_USERS = 3;
	private static final String BODY = "{\"gameMode\":\"CLASSIC\",\"maxUsers\":%d}".formatted(NEW_MAX_USERS);

	private MemoryPartyRepository repository;
	private User owner;
	private Party party;
	private MockMvc mockMvc;

	@BeforeEach
	void beforeEach() {
		this.repository = new MemoryPartyRepository();
		this.owner = new User("user-1", "Owner", UserPlatform.WEB);
		this.party = new Party(this.owner, GameModes.CLASSIC);
		this.repository.save(this.party);
		this.mockMvc = this.createMockMvcOf(this.owner);
	}

	@Test
	void testGivenPartyCodeInThePath_whenUpdateParty_thenThatPartyHasTheNewCapacity() throws Exception {
		this.mockMvc.perform(this.updateRequest());

		assertThat(this.repository.find(this.party.getCode()).getMaxUsers()).isEqualTo(NEW_MAX_USERS);
	}

	@Test
	void testGivenUserWhoIsNotTheOwner_whenUpdateParty_thenResponseIsBadRequest() throws Exception {
		MockMvc mockMvcOfOther = this.createMockMvcOf(new User("user-2", "Other", UserPlatform.WEB));

		mockMvcOfOther.perform(this.updateRequest()) //
				.andExpect(status().isBadRequest());
	}

	@Test
	void testGivenUserWhoIsNotTheOwner_whenUpdateParty_thenBodyCarriesTheNotOwnerKey() throws Exception {
		MockMvc mockMvcOfOther = this.createMockMvcOf(new User("user-2", "Other", UserPlatform.WEB));

		mockMvcOfOther.perform(this.updateRequest()) //
				.andExpect(jsonPath("$.key").value("exception.party.user_is_not_party_owner"));
	}

	private MockMvc createMockMvcOf(User user) {
		PartyOwnerService service = new PartyOwnerService(this.repository, null);
		WebPartyOwnerController controller = new WebPartyOwnerController(service);
		controller.setUserSession(user);
		return MockMvcBuilders.standaloneSetup(controller) //
				.setControllerAdvice(new RestExceptionAdvice()) //
				.build();
	}

	private MockHttpServletRequestBuilder updateRequest() {
		byte[] bytes = this.party.getCode().text().getBytes(StandardCharsets.UTF_8);
		String partyCode = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

		return put("/party/{partyCode}", partyCode) //
				.contentType(MediaType.APPLICATION_JSON) //
				.content(BODY);
	}
}
