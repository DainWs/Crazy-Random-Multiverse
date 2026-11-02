package com.dainws.games.crm.configuration;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

class SecurityConfigurationTest {

	private static final String EXPLICIT_ORIGIN = "https://crm.example";
	private static final String ANY_ORIGIN = "*";
	private static final String ACTION_PATH = "/game/code/action";

	private CorsConfiguration corsConfiguration;

	@BeforeEach
	void beforeEach() {
		SecurityConfiguration configuration = new SecurityConfiguration();
		ReflectionTestUtils.setField(configuration, "origin", EXPLICIT_ORIGIN);
		CorsConfigurationSource source = configuration.corsConfigurationSource();

		MockHttpServletRequest request = new MockHttpServletRequest("POST", ACTION_PATH);
		request.setServletPath(ACTION_PATH);
		this.corsConfiguration = source.getCorsConfiguration(request);
	}

	@Test
	void testGivenOrigin_whenCreateCorsConfiguration_thenOnlyThatOriginIsAllowed() {
		assertThat(this.corsConfiguration.getAllowedOrigins()).containsExactly(EXPLICIT_ORIGIN);
	}

	@Test
	void testGivenOrigin_whenCreateCorsConfiguration_thenAnyOriginIsNotAllowed() {
		assertThat(this.corsConfiguration.getAllowedOrigins()).doesNotContain(ANY_ORIGIN);
	}

	@Test
	void testGivenOrigin_whenCreateCorsConfiguration_thenCredentialsAreAllowed() {
		assertThat(this.corsConfiguration.getAllowCredentials()).isTrue();
	}
}
