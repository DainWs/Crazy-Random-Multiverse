package com.dainws.games.crm.domain.mode.classic;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;
import com.dainws.games.crm.domain.core.player.Player;

public class RecordingGameFlow implements GameFlow {
	private int nextTurnCount;
	private List<Player> eliminatedPlayers = new ArrayList<>();

	@Override
	public void onStartGame(Game game) {
	}

	@Override
	public void onEndGame(Game game) {
	}

	@Override
	public void onNextTurn(Game game) {
		this.nextTurnCount++;
	}

	@Override
	public void onPrevTurn(Game game) {
	}

	@Override
	public void updateGame(Game game) {
	}

	@Override
	public void eliminatePlayer(Game game, Player player) {
		this.eliminatedPlayers.add(player);
	}

	public List<Player> getEliminatedPlayers() {
		return this.eliminatedPlayers;
	}

	public int getNextTurnCount() {
		return this.nextTurnCount;
	}
}
