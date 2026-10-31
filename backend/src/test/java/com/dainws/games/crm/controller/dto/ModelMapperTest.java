package com.dainws.games.crm.controller.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.domain.CardDto;
import com.dainws.games.crm.controller.dto.domain.GameDto;
import com.dainws.games.crm.controller.dto.domain.PlayerDto;
import com.dainws.games.crm.controller.dto.domain.ZoneDto;
import com.dainws.games.crm.controller.dto.domain.ZoneSlotDto;
import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.DummyZone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;

class ModelMapperTest {

	private static final Coordinate WARRIOR_COORDINATE = new Coordinate(1, 0);
	private static final Coordinate EMPTY_COORDINATE = new Coordinate(1, 1);

	@Test
	void testGivenPlayer_whenMapToDto_thenCodeIsThePlayerCode() {
		Player player = new PlayerBuilder().build();

		PlayerDto playerDto = ModelMapper.mapPlayerToDto(player);

		assertThat(playerDto.getCode()).isEqualTo(player.getCode());
	}

	@Test
	void testGivenDeadPlayer_whenMapToDto_thenIsNotAlive() {
		Player player = new PlayerBuilder().build();
		player.die();

		PlayerDto playerDto = ModelMapper.mapPlayerToDto(player);

		assertThat(playerDto.isAlive()).isFalse();
	}

	@Test
	void testGivenDeadPlayer_whenMapToDto_thenIsSpectator() {
		Player player = new PlayerBuilder().build();
		player.die();

		PlayerDto playerDto = ModelMapper.mapPlayerToDto(player);

		assertThat(playerDto.isSpectator()).isTrue();
	}

	@Test
	void testGivenAlivePlayer_whenMapToDto_thenIsAlive() {
		Player player = new PlayerBuilder().build();

		PlayerDto playerDto = ModelMapper.mapPlayerToDto(player);

		assertThat(playerDto.isAlive()).isTrue();
	}

	@Test
	void testGivenAlivePlayer_whenMapToDto_thenIsNotSpectator() {
		Player player = new PlayerBuilder().build();

		PlayerDto playerDto = ModelMapper.mapPlayerToDto(player);

		assertThat(playerDto.isSpectator()).isFalse();
	}

	@Test
	void testGivenDeadPlayer_whenMapGame_thenGameHasNoZoneOfThatPlayer() {
		Game game = new GameBuilder() //
				.withZoneFactory(ZoneWithLeader::new) //
				.withNRandomPlayers(3) //
				.build();
		game.getPlayers().get(0).die();

		GameDto gameDto = ModelMapper.mapGameToDto(game, game.getPlayers().get(1));

		assertThat(gameDto.getZones()).hasSize(2);
	}

	@Test
	void testGivenZoneWithLeader_whenMapZone_thenLeaderSlotAllowsLeader() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		ZoneSlotDto leaderSlot = zoneDto.getCombatants()[0][0];

		assertThat(leaderSlot.getAllowedCombatant()).isEqualTo(CardType.LEADER);
	}

	@Test
	void testGivenZoneWithLeader_whenMapZone_thenWarriorSlotAllowsWarrior() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		ZoneSlotDto warriorSlot = zoneDto.getCombatants()[1][0];

		assertThat(warriorSlot.getAllowedCombatant()).isEqualTo(CardType.WARRIOR);
	}

	@Test
	void testGivenEmptySlot_whenMapZone_thenSlotHasNoCombatant() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		assertThat(this.combatantAt(zoneDto, EMPTY_COORDINATE)).isNull();
	}

	@Test
	void testGivenProtectedLeader_whenMapZone_thenLeaderIsProtected() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		CardDto leaderDto = zoneDto.getCombatants()[0][0].getCombatant();

		assertThat(leaderDto.isProtectedCard()).isTrue();
	}

	@Test
	void testGivenProtectedLeader_whenMapZone_thenLeaderIsNotTargetable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		CardDto leaderDto = zoneDto.getCombatants()[0][0].getCombatant();

		assertThat(leaderDto.isTargetable()).isFalse();
	}

	@Test
	void testGivenExposedEnemyWarrior_whenMapZone_thenWarriorIsNotProtected() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isProtectedCard()).isFalse();
	}

	@Test
	void testGivenExposedEnemyWarrior_whenMapZone_thenWarriorIsTargetableForViewer() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isTargetable()).isTrue();
	}

	@Test
	void testGivenViewerIsOwner_whenMapZone_thenCardsAreNotTargetable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByItsOwner();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isTargetable()).isFalse();
	}

	@Test
	void testGivenWarriorThatCanAttack_whenMapZone_thenAttackIsAvailable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isAttackAvailable()).isTrue();
	}

	@Test
	void testGivenWarrior_whenMapCard_thenCardCodeTravelsAsText() {
		Warrior warrior = CardBuilder.buildCommonWarrior();

		CardDto cardDto = ModelMapper.mapCardToDto(warrior);

		assertThat(cardDto.getCode().getCode())
				.isEqualTo(String.valueOf(warrior.getCode().code()));
	}

	@Test
	void testGivenEquippedWarrior_whenMapCard_thenDtoContainsEquipment() {
		Warrior warrior = CardBuilder.buildCommonWarrior();
		warrior.equip(CardBuilder.buildEquipment());

		CardDto cardDto = ModelMapper.mapCardToDto(warrior);

		assertThat(cardDto.getEquipment().getType()).isEqualTo(CardType.EQUIPMENT);
	}

	@Test
	void testGivenZoneWithLeader_whenMapZone_thenTypeIsBase() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		assertThat(zoneDto.getType()).isEqualTo("BASE");
	}

	@Test
	void testGivenZone_whenMapZone_thenTypeIsTheTextOfTheZoneType() {
		Player owner = new PlayerBuilder().withCode("owner").build();
		DummyZone zone = new DummyZone();
		zone.setOwner(owner);
		Player viewer = new PlayerBuilder().withCode("viewer").build();

		ZoneDto zoneDto = ModelMapper.mapPlayerZoneToDto(zone, owner, viewer);

		assertThat(zoneDto.getType()).isEqualTo(zone.getType().text());
	}

	private CardDto combatantAt(ZoneDto zoneDto, Coordinate coordinate) {
		ZoneSlotDto[] row = zoneDto.getCombatants()[coordinate.getRow()];
		return row[coordinate.getColumn()].getCombatant();
	}

	private ZoneDto mapZoneSeenByAnotherPlayer() throws NotAllowedException {
		Player viewer = new PlayerBuilder().withCode("viewer").build();
		return this.mapZoneSeenBy(viewer);
	}

	private ZoneDto mapZoneSeenByItsOwner() throws NotAllowedException {
		return this.mapZoneSeenBy(this.createOwner());
	}

	private ZoneDto mapZoneSeenBy(Player viewer) throws NotAllowedException {
		Player owner = this.createOwner();
		ZoneWithLeader zone = new ZoneWithLeader(2, 2);
		zone.setOwner(owner);
		Leader leader = CardBuilder.buildLeader();
		Warrior warrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);
		zone.putCombatant(WARRIOR_COORDINATE, warrior);

		return ModelMapper.mapPlayerZoneToDto(zone, owner, viewer);
	}

	private Player createOwner() {
		return new PlayerBuilder().withCode("owner").build();
	}
}
