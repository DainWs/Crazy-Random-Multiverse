package com.dainws.games.crm.domain.mode.classic;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Consumer;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.mode.GameModeEventDispatcher;

public class ClassicEventDispatcher implements GameModeEventDispatcher {

	private ClassicGameFlowService gameFlowService;
	private Map<EventCode, Consumer<Event>> eventConsumers;

	public ClassicEventDispatcher() {
		this.gameFlowService = new ClassicGameFlowService();
		this.eventConsumers = new EnumMap<>(EventCode.class);
		this.eventConsumers.put(EventCode.GAME_STARTING, this::handleGameStarting);
		this.eventConsumers.put(EventCode.GAME_START, this::handleGameStart);
		this.eventConsumers.put(EventCode.GAME_END, this::handleGameEnd);
		this.eventConsumers.put(EventCode.GAME_END_WITH_WINNER, this::handleGameEndWithWinner);
		this.eventConsumers.put(EventCode.GAME_END_WITH_TIE, this::handleGameEndWithTie);
		this.eventConsumers.put(EventCode.TURN_CHANGE, this::handleTurnChange);
		this.eventConsumers.put(EventCode.ROUND_CHANGE, this::handleRoundChange);
		this.eventConsumers.put(EventCode.PLAYER_DIE, this::handlePlayerDie);
		this.eventConsumers.put(EventCode.PLAYER_SURRENDER, this::handlePlayerSurrender);
		this.eventConsumers.put(EventCode.PLAYER_RECEIVE_CARD, this::handlePlayerReceiveCard);
		this.eventConsumers.put(EventCode.PLAYER_PUT_CARD, this::handlePlayerPutCard);
		this.eventConsumers.put(EventCode.PLAYER_MOVE_CARD, this::handlePlayerMoveCard);
		this.eventConsumers.put(EventCode.PLAYER_ATTACK_CARD, this::handlePlayerAttackCard);
		this.eventConsumers.put(EventCode.PLAYER_EQUIP_CARD, this::handlePlayerEquipCard);
		this.eventConsumers.put(EventCode.PLAYER_USE_CARD, this::handlePlayerUseCard);
		this.eventConsumers.put(EventCode.PLAYER_PASS_TURN, this::handlePlayerPassTurn);
	}

	@Override
	public GameMode getGameMode() {
		return ClassicGame.CLASSIC_GAME_MODE;
	}

	@Override
	public void dispatch(Event event) {
		Consumer<Event> consumer = this.eventConsumers.get(event.getCode());
		consumer.accept(event);
	}

	private void handleGameStarting(Event event) { //
	}

	private void handleGameStart(Event event) {
		ClassicGame game = this.getGameFromEvent(event);
		this.gameFlowService.startGame(game);
	}

	private void handleGameEnd(Event event) {
		ClassicGame game = this.getGameFromEvent(event);
		this.gameFlowService.endGame(game);
	}

	private void handleGameEndWithWinner(Event event) { //
	}

	private void handleGameEndWithTie(Event event) { //
	}

	private void handleTurnChange(Event event) { //
	}

	private void handleRoundChange(Event event) { //
	}

	private void handlePlayerDie(Event event) {
		ClassicGame game = this.getGameFromEvent(event);
		this.gameFlowService.updateGame(game);
	}

	private void handlePlayerSurrender(Event event) {
		ClassicGame game = this.getGameFromEvent(event);
		this.gameFlowService.updateGame(game);
	}

	private void handlePlayerReceiveCard(Event event) {
	}

	private void handlePlayerPutCard(Event event) {
	}

	private void handlePlayerMoveCard(Event event) {
	}

	private void handlePlayerAttackCard(Event event) {
		ClassicGame game = this.getGameFromEvent(event);
		this.gameFlowService.updateGame(game);
	}

	private void handlePlayerEquipCard(Event event) {
	}

	private void handlePlayerUseCard(Event event) {
	}

	private void handlePlayerPassTurn(Event event) {
		ClassicGame game = this.getGameFromEvent(event);
		this.gameFlowService.nextTurn(game);
	}

	private ClassicGame getGameFromEvent(Event event) {
		return (ClassicGame) event.getDetails().getGame();
	}
}
