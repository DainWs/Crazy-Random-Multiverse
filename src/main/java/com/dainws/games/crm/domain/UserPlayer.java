package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class UserPlayer extends Player {

	private User user;
	
	public UserPlayer(User user) {
		super(PlayerCode.from(user.getCode().getValue()), user.getName());
		this.user = user;
	}
	
	public boolean is(UserCode userCode) {
		return this.user.getCode().equals(userCode);
	}
	
	public boolean is(User user) {
		return this.user.equals(user);
	}
	
	public boolean isPlayingOn(UserPlatform platform) {
		return this.user.isPlayingFrom(platform);
	}

}
