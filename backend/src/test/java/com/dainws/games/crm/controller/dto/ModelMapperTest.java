package com.dainws.games.crm.controller.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.response.CardDto;
import com.dainws.games.crm.controller.dto.response.GameDto;
import com.dainws.games.crm.controller.dto.response.PlayerDto;
import com.dainws.games.crm.controller.dto.response.ZoneDto;
import com.dainws.games.crm.controller.dto.response.ZoneSlotDto;
import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.DummyZone;
import com.dainws.games.crm.domain.core.board.Zone;
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
	void testGivenPlayerWithCardsInHand_whenMapToDto_thenHandSizeIsTheNumberOfCards() {
		Player player = new PlayerBuilder().build();
		player.getHand().addCard(CardBuilder.buildCommonWarrior());
		player.getHand().addCard(CardBuilder.buildCommonWarrior());

		PlayerDto playerDto = ModelMapper.mapPlayerToDto(player);

		assertThat(playerDto.getHandSize()).isEqualTo(2);
	}

	@Test
	void testGivenGameNotInProgress_whenMapGame_thenThereIsNoPlayerWithTurn() {
		Game game = new GameBuilder().withNRandomPlayers(2).build();

		GameDto gameDto = ModelMapper.mapGameToDto(game, game.getPlayers().get(0));

		assertThat(gameDto.getPlayerWithTurn()).isNull();
	}

	@Test
	void testGivenGameInProgress_whenMapGame_thenPlayerWithTurnIsSent() {
		Game game = new GameBuilder().withNRandomPlayers(2).build();
		GameStatusSetter.setStatus(game, Status.IN_PROGRESS);

		GameDto gameDto = ModelMapper.mapGameToDto(game, game.getPlayers().get(0));

		assertThat(gameDto.getPlayerWithTurn().getCode()).isEqualTo(game.getPlayerWithTurn().getCode());
	}

	@Test
	void testGivenGameWithoutRound_whenMapGame_thenThereIsNoRound() {
		Game game = new GameBuilder().withNRandomPlayers(2).build();

		GameDto gameDto = ModelMapper.mapGameToDto(game, game.getPlayers().get(0));

		assertThat(gameDto.getRound()).isNull();
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
	void testGivenOwnWarriorThatCanAttackOnItsTurn_whenMapZone_thenAttackIsAvailable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneOfThePlayerWithTurnSeenByItsOwner();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isAttackAvailable()).isTrue();
	}

	@Test
	void testGivenOwnWarriorOutsideItsTurn_whenMapZone_thenAttackIsNotAvailable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneOfThePlayerWithoutTurnSeenByItsOwner();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isAttackAvailable()).isFalse();
	}

	@Test
	void testGivenRivalWarrior_whenMapZone_thenAttackIsNotAvailable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneSeenByAnotherPlayer();

		CardDto warriorDto = this.combatantAt(zoneDto, WARRIOR_COORDINATE);

		assertThat(warriorDto.isAttackAvailable()).isFalse();
	}

	@Test
	void testGivenOwnProtectedLeaderOnItsTurn_whenMapZone_thenAttackIsNotAvailable() throws NotAllowedException {
		ZoneDto zoneDto = this.mapZoneOfThePlayerWithTurnSeenByItsOwner();

		CardDto leaderDto = zoneDto.getCombatants()[0][0].getCombatant();

		assertThat(leaderDto.isAttackAvailable()).isFalse();
	}

	@Test
	void testGivenSpectatorViewer_whenMapZone_thenCardsAreNotTargetable() throws NotAllowedException {
		Player spectator = new PlayerBuilder().withCode("viewer").build();
		spectator.die();

		ZoneDto zoneDto = this.mapZoneSeenBy(spectator);

		assertThat(this.combatantAt(zoneDto, WARRIOR_COORDINATE).isTargetable()).isFalse();
	}

	@Test
	void testGivenWarrior_whenMapCard_thenCardCodeTravelsAsText() {
		Warrior warrior = CardBuilder.buildCommonWarrior();

		CardDto cardDto = ModelMapper.mapCardToDto(warrior);

		assertThat(cardDto.getCatalogCode().getCode())
				.isEqualTo(String.valueOf(warrior.getCode().code()));
	}

	@Test
	void testGivenEquippedWarrior_whenMapCard_thenDtoContainsEquipment() {
		Warrior warrior = CardBuilder.buildCommonWarrior();
		warrior.equip(CardBuilder.buildEquipment());

		CardDto cardDto = ModelMapper.mapCardToDto(warrior);

		assertThat(cardDto.getEquipment().get(0).getType()).isEqualTo(CardType.EQUIPMENT);
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

		ZoneDto zoneDto = this.mapZone(zone, owner, viewer);

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

	private ZoneDto mapZoneOfThePlayerWithTurnSeenByItsOwner() throws NotAllowedException {
		Game game = this.createGameWithTwoPlayers();
		Player owner = game.getPlayerWithTurn();
		return this.mapZone(game, this.createZoneWithLeaderAndWarrior(owner), owner, owner);
	}

	private ZoneDto mapZoneOfThePlayerWithoutTurnSeenByItsOwner() throws NotAllowedException {
		Game game = this.createGameWithTwoPlayers();
		Player owner = game.getPlayers().stream() //
				.filter(player -> !player.equals(game.getPlayerWithTurn())) //
				.findFirst().orElseThrow();
		return this.mapZone(game, this.createZoneWithLeaderAndWarrior(owner), owner, owner);
	}

	private ZoneDto mapZoneSeenBy(Player viewer) throws NotAllowedException {
		Player owner = this.createOwner();
		return this.mapZone(this.createZoneWithLeaderAndWarrior(owner), owner, viewer);
	}

	private ZoneWithLeader createZoneWithLeaderAndWarrior(Player owner) throws NotAllowedException {
		ZoneWithLeader zone = new ZoneWithLeader(2, 2);
		zone.setOwner(owner);
		Leader leader = CardBuilder.buildLeader();
		Warrior warrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, leader);
		zone.putCombatant(WARRIOR_COORDINATE, warrior);
		return zone;
	}

	private ZoneDto mapZone(Zone zone, Player owner, Player viewer) {
		Game game = new GameBuilder().withPlayers(owner, viewer).build();
		return this.mapZone(game, zone, owner, viewer);
	}

	private ZoneDto mapZone(Game game, Zone zone, Player owner, Player viewer) {
		game.getBoard().setZone(owner, zone);
		return ModelMapper.mapPlayerZoneToDto(game, owner, viewer);
	}

	private Game createGameWithTwoPlayers() {
		return new GameBuilder().withNRandomPlayers(2).build();
	}

	private Player createOwner() {
		return new PlayerBuilder().withCode("owner").build();
	}
}
