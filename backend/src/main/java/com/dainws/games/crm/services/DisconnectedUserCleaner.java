package com.dainws.games.crm.services;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DisconnectedUserCleaner {
	private UserService userService;

	public DisconnectedUserCleaner(UserService userService) {
		this.userService = userService;
	}

	@Scheduled(fixedDelayString = "${crm.user.cleanup-interval}")
	public void deleteDisconnectedUsers() {
		this.userService.deleteDisconnectedUsers();
	}
}
