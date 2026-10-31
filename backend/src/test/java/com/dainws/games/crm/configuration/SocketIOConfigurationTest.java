package com.dainws.games.crm.configuration;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Bean;
import org.springframework.test.util.ReflectionTestUtils;

import com.corundumstudio.socketio.SocketIOServer;

class SocketIOConfigurationTest {

	private static final String EXPLICIT_ORIGIN = "https://crm.example";
	private static final String SERVER_BEAN_METHOD = "socketIOServer";

	@Test
	void testGivenSocketIOServerBean_whenContextStarts_thenServerIsStarted() throws NoSuchMethodException {
		Method method = this.getServerBeanMethod();

		Bean bean = method.getAnnotation(Bean.class);

		assertThat(bean.initMethod()).isEqualTo("start");
	}

	@Test
	void testGivenSocketIOServerBean_whenContextCloses_thenServerIsStopped() throws NoSuchMethodException {
		Method method = this.getServerBeanMethod();

		Bean bean = method.getAnnotation(Bean.class);

		assertThat(bean.destroyMethod()).isEqualTo("stop");
	}

	@Test
	void testGivenOrigin_whenCreateServer_thenServerAllowsThatOrigin() {
		SocketIOConfiguration configuration = new SocketIOConfiguration();
		ReflectionTestUtils.setField(configuration, "origin", EXPLICIT_ORIGIN);

		SocketIOServer server = configuration.socketIOServer();

		String origin = server.getConfiguration().getOrigin();
		assertThat(origin).isEqualTo(EXPLICIT_ORIGIN);
	}

	private Method getServerBeanMethod() throws NoSuchMethodException {
		Class<SocketIOConfiguration> type = SocketIOConfiguration.class;
		return type.getDeclaredMethod(SERVER_BEAN_METHOD);
	}
}
