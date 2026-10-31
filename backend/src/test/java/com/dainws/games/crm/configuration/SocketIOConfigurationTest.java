package com.dainws.games.crm.configuration;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.corundumstudio.socketio.SocketIOServer;

class SocketIOConfigurationTest {

	private static final String EXPLICIT_ORIGIN = "https://crm.example";

	@Test
	void testGivenOrigin_whenCreateServer_thenServerAllowsThatOrigin() {
		SocketIOConfiguration configuration = new SocketIOConfiguration();
		ReflectionTestUtils.setField(configuration, "origin", EXPLICIT_ORIGIN);

		SocketIOServer server = configuration.socketIOServer();

		String origin = server.getConfiguration().getOrigin();
		assertThat(origin).isEqualTo(EXPLICIT_ORIGIN);
	}
}
