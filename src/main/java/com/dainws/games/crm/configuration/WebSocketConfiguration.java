package com.dainws.games.crm.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.session.MapSession;
import org.springframework.session.web.socket.config.annotation.AbstractSessionWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import com.dainws.games.crm.controller.CommunicationClient;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration extends AbstractSessionWebSocketMessageBrokerConfigurer<MapSession> {

	@Value("${websocket.broker:/topic}")
	private String simpleBroker;

	@Value("${websocket.application.prefix:/application}")
	private String applicationPrefix;

	@Value("${websocket.users.prefix:/user}")
	private String userPrefix;

	@Value("${websocket.endpoint:/ws}")
	private String endpoint;

	@Override
	protected void configureStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint(this.endpoint)
			.setAllowedOrigins("*"); // TODO be carefull CSRF attack
		
		registry.addEndpoint(this.endpoint)
			.setAllowedOrigins("*") // TODO be carefull CSRF attack
			.withSockJS();
	}
	
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker(this.simpleBroker);
		registry.setApplicationDestinationPrefixes(this.applicationPrefix);
		registry.setUserDestinationPrefix(this.userPrefix);
	}
	
	@Bean
	CommunicationClient communicationChannel(SimpMessagingTemplate messagingTemplate) {
		return new CommunicationClient(messagingTemplate);
	}
}
