package com.dainws.games.crm.controller.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.corundumstudio.socketio.protocol.JacksonJsonSupport;
import com.dainws.games.crm.controller.dto.domain.EventDto;
import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufOutputStream;
import io.netty.buffer.Unpooled;

/**
 * Pins the names and the shape of the JSON that the frontend receives.
 */
class EventDtoJsonTest {

	private static final int SEQUENCE = 5;
	private static final int WARRIOR_ROW = 1;
	private static final int WARRIOR_COLUMN = 0;

	JsonNode json;
	JsonNode details;
	JsonNode zone;
	JsonNode card;
	JsonNode player;
	JsonNode zoneWithoutLeader;

	@BeforeEach
	void beforeEach() throws NotAllowedException, IOException {
		Game game = new GameBuilder() //
				.withZoneFactory(ZoneWithLeader::new) //
				.withNRandomPlayers(2) //
				.build();
		Player receiver = game.getPlayers().get(0);
		ZoneWithLeader receiverZone =
				(ZoneWithLeader) game.getBoard().getZoneOf(receiver);
		Leader leader = CardBuilder.buildLeader();
		Warrior warrior = CardBuilder.buildCommonWarrior();
		Coordinate warriorCoordinate =
				new Coordinate(WARRIOR_ROW, WARRIOR_COLUMN);
		receiverZone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);
		receiverZone.putCombatant(warriorCoordinate, warrior);
		receiver.getHand().addCard(CardBuilder.buildCommonWarrior());
		Event event = new Event(EventCode.GAME_SYNC, game);
		event.setSequence(SEQUENCE);

		EventDto eventDto = new CommunicationMapper().mapToDto(event, receiver);

		this.json = this.serializeLikeSocketIO(eventDto);
		this.details = this.json.get("details");
		this.zone = this.details.get("game").get("zones").get(0);
		this.card = this.zone.get("combatants").get(WARRIOR_ROW)
				.get(WARRIOR_COLUMN).get("combatant");
		this.player = this.details.get("game").get("playerWithTurn");
		this.zoneWithoutLeader = this.details.get("game").get("zones").get(1);
	}

	@Test
	void testGivenGameSync_whenSerialize_thenCodeIsGameSync() {
		assertThat(this.json.get("code").asText()).isEqualTo("GAME_SYNC");
	}

	@Test
	void testGivenGameSync_whenSerialize_thenSequenceIsTheEventSequence() {
		assertThat(this.json.get("sequence").asInt()).isEqualTo(SEQUENCE);
	}

	@Test
	void testGivenGameSync_whenSerialize_thenDetailsHaveTheHand() {
		assertThat(this.details.has("hand")).isTrue();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenZoneTypeIsBase() {
		assertThat(this.zone.get("type").asText()).isEqualTo("BASE");
	}

	@Test
	void testGivenGameSync_whenSerialize_thenZoneHasNoTeam() {
		assertThat(this.zone.has("team")).isFalse();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenCardHasTheProtectedFlag() {
		assertThat(this.card.has("protected")).isTrue();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenCardHasTheAttackAvailableFlag() {
		assertThat(this.card.has("attackAvailable")).isTrue();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenCardHasTheTargetableFlag() {
		assertThat(this.card.has("targetable")).isTrue();
	}

	@Test
	void testGivenCardWithoutEquipment_whenSerialize_thenEquipmentIsNotSent() {
		assertThat(this.card.has("equipment")).isFalse();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenPlayerKeepsTheIsAliveProperty() {
		assertThat(this.player.has("isAlive")).isTrue();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenPlayerHasNoDuplicatedAliveProperty() {
		assertThat(this.player.has("alive")).isFalse();
	}

	@Test
	void testGivenZoneWithLeader_whenSerialize_thenZoneHasHealth() {
		assertThat(this.zone.has("health")).isTrue();
	}

	@Test
	void testGivenZoneWithoutLeader_whenSerialize_thenZoneHasNoHealth() {
		assertThat(this.zoneWithoutLeader.has("health")).isFalse();
	}

	@Test
	void testGivenGameSync_whenSerialize_thenCardCodeTravelsAsText() {
		assertThat(this.card.get("code").get("code").isTextual()).isTrue();
	}

	private JsonNode serializeLikeSocketIO(EventDto eventDto) throws IOException {
		ByteBuf buffer = Unpooled.buffer();
		new JacksonJsonSupport().writeValue(new ByteBufOutputStream(buffer), eventDto);
		String text = buffer.toString(StandardCharsets.UTF_8);
		return new ObjectMapper().readTree(text);
	}
}
