package com.dainws.games.crm.domain.error;

import java.util.List;

import com.dainws.games.crm.domain.core.player.Player;

public interface ErrorChannel {
	void send(List<Player> to, Error error);

	void send(Player to, Error error);
}
