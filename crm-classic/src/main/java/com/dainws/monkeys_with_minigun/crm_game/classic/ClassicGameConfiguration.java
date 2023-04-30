package com.dainws.monkeys_with_minigun.crm_game.classic;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "classic.game")
public class ClassicGameConfiguration {
	private String leadersJsonFile
}
