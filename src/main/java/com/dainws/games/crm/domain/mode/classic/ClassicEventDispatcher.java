package com.dainws.games.crm.domain.mode.classic;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Consumer;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.mode.GameModeEventDispatcher;

public class ClassicEventDispatcher implements GameModeEventDispatcher {

	private static final Consumer<Event> NONE = (event) -> {
	};

	private GameFlow gameFlow;

	private Map<EventCode, Consumer<Event>> eventConsumers;

	public ClassicEventDispatcher() {
		this(new ClassicGameFlow());
	}

	public ClassicEventDispatcher(GameFlow gameFlow) {
		this.gameFlow = gameFlow;
		this.eventConsumers = new EnumMap<>(EventCode.class);
		this.eventConsumers.put(EventCode.GAME_CREATED, NONE);
		this.eventConsumers.put(EventCode.GAME_RESTART, this::handleGameRestart);
		this.eventConsumers.put(EventCode.GAME_START, this::handleGameStart);
		this.eventConsumers.put(EventCode.GAME_END, this::handleGameEnd);
		this.eventConsumers.put(EventCode.TURN_CHANGE, NONE);
		this.eventConsumers.put(EventCode.ROUND_CHANGE, NONE);
		this.eventConsumers.put(EventCode.PLAYER_DIE, this::handlePlayerDie);
		this.eventConsumers.put(EventCode.PLAYER_SURRENDER, this::handlePlayerSurrender);
		this.eventConsumers.put(EventCode.PLAYER_RECEIVE_CARD, NONE);
		this.eventConsumers.put(EventCode.PLAYER_PUT_CARD, NONE);
		this.eventConsumers.put(EventCode.PLAYER_MOVE_CARD, NONE);
		this.eventConsumers.put(EventCode.PLAYER_ATTACK_CARD, this::handlePlayerAttackCard);
		this.eventConsumers.put(EventCode.PLAYER_EQUIP_CARD, NONE);
		this.eventConsumers.put(EventCode.PLAYER_USE_CARD, NONE);
		this.eventConsumers.put(EventCode.PLAYER_PASS_TURN, this::handlePlayerPassTurn);
	}

	@Override
	public GameMode getGameMode() {
		return ClassicModeStrategy.CLASSIC_MODE;
	}

	@Override
	public void dispatch(Event event) {
		Consumer<Event> consumer = this.eventConsumers.getOrDefault(event.getCode(), NONE);
		consumer.accept(event);
	}

	private void handleGameRestart(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.onRestartGame(game);
	}

	private void handleGameStart(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.onStartGame(game);
	}

	private void handleGameEnd(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.onEndGame(game);
	}

	private void handlePlayerDie(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.updateGame(game);
	}

	private void handlePlayerSurrender(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.updateGame(game);
	}

	private void handlePlayerAttackCard(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.updateGame(game);
	}

	private void handlePlayerPassTurn(Event event) {
		Game game = this.getGameFromEvent(event);
		this.gameFlow.onNextTurn(game);
	}

	private Game getGameFromEvent(Event event) {
		return event.getDetails().getGame();
	}
}
