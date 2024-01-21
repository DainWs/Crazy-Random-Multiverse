package com.dainws.games.cbg.domain.error;

import java.util.List;

import com.dainws.games.cbg.domain.player.Player;

public interface ErrorChannel {
	void send(List<Player> to, Error error);

	void send(Player to, Error error);
}
