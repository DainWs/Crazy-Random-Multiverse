package com.dainws.games.crm.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;

@org.springframework.context.annotation.Configuration
@ConditionalOnProperty(value = "crm.communication.socket-io.enabled", havingValue = "true", matchIfMissing = true)
public class SocketIOConfiguration {
    @Value("${crm.communication.socket-io.origin:*}")
    private String origin;

    @Bean(initMethod = "start", destroyMethod = "stop")
    SocketIOServer socketIOServer() {
    	Configuration config = new Configuration();
        config.setHostname("0.0.0.0");
        config.setPort(9092);
        config.setOrigin(origin);

        return new SocketIOServer(config);
    }

}