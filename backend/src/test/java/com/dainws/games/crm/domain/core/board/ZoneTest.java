package com.dainws.games.crm.domain.core.board;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;

class ZoneTest {

	private static final int HORIZONTAL_DIMENSION = 2;
	private static final int VERTICAL_DIMENSION = 2;
	private static final String PREVIOUS_ROW_REQUIRED_CODE = "exception.zone.row.previous_need_to_be_filled";
	private static final int FIRST_ROW = 0;
	private static final int SECOND_ROW = 1;

	@Test
	void testGivenFirstRowNotFilled_whenPutCombatantInSecondRow_thenThrowsNotAllowed() throws NotAllowedException {
		Zone zone = this.createZone();
		zone.putCombatant(new Coordinate(FIRST_ROW, 0), CardBuilder.buildCommonWarrior());

		assertThatThrownBy(() -> zone.putCombatant(new Coordinate(SECOND_ROW, 0), CardBuilder.buildCommonWarrior()))
				.isInstanceOf(NotAllowedException.class)
				.hasFieldOrPropertyWithValue("codeValue", PREVIOUS_ROW_REQUIRED_CODE);
	}

	@Test
	void testGivenFirstRowFilled_whenPutCombatantInSecondRow_thenCombatantIsPlaced() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate coordinate = new Coordinate(SECOND_ROW, 0);

		zone.putCombatant(coordinate, CardBuilder.buildCommonWarrior());

		assertThat(zone.hasCombatant(coordinate)).isTrue();
	}

	@Test
	void testGivenFirstRowNotFilled_whenAddCombatantAtSecondRow_thenThrowsNotAllowed() {
		Zone zone = this.createZone();

		assertThatThrownBy(() -> zone.addCombatantAt(SECOND_ROW, CardBuilder.buildCommonWarrior()))
				.isInstanceOf(NotAllowedException.class)
				.hasFieldOrPropertyWithValue("codeValue", PREVIOUS_ROW_REQUIRED_CODE);
	}

	@Test
	void testGivenFirstRowFilled_whenAddCombatantAtSecondRow_thenCombatantIsPlacedInSecondRow() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();

		zone.addCombatantAt(SECOND_ROW, CardBuilder.buildCommonWarrior());

		assertThat(zone.countCombatantsAt(SECOND_ROW)).isEqualTo(1);
	}

	@Test
	void testGivenEmptyZone_whenAddCombatant_thenCombatantIsPlacedInFirstRow() throws NotAllowedException {
		Zone zone = this.createZone();

		zone.addCombatant(CardBuilder.buildCommonWarrior());

		assertThat(zone.countCombatantsAt(FIRST_ROW)).isEqualTo(1);
	}

	@Test
	void testGivenFirstRowFilled_whenAddCombatant_thenCombatantIsPlacedInSecondRow() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();

		zone.addCombatant(CardBuilder.buildCommonWarrior());

		assertThat(zone.countCombatantsAt(SECOND_ROW)).isEqualTo(1);
	}

	@Test
	void testGivenCombatantWithCombatantInFrontRow_whenIsProtectedAt_thenIsProtected() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		zone.putCombatant(new Coordinate(SECOND_ROW, 0), CardBuilder.buildCommonWarrior());

		assertThat(zone.isProtectedAt(new Coordinate(FIRST_ROW, 0))).isTrue();
	}

	@Test
	void testGivenCombatantWithEmptyFrontRow_whenIsProtectedAt_thenIsNotProtected() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();

		assertThat(zone.isProtectedAt(new Coordinate(FIRST_ROW, 0))).isFalse();
	}

	@Test
	void testGivenCombatantInLastRow_whenIsProtectedAt_thenIsNotProtected() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		zone.putCombatant(new Coordinate(SECOND_ROW, 0), CardBuilder.buildCommonWarrior());

		assertThat(zone.isProtectedAt(new Coordinate(SECOND_ROW, 0))).isFalse();
	}

	@Test
	void testGivenLeaderWithWarriorInFrontRow_whenIsProtectedAt_thenLeaderIsProtected() throws NotAllowedException {
		ZoneWithLeader zone = new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, CardBuilder.buildLeader());
		zone.putCombatant(new Coordinate(1, 0), CardBuilder.buildCommonWarrior());

		assertThat(zone.isProtectedAt(ZoneWithLeader.LEADER_COORDINATE)).isTrue();
	}

	@Test
	void testGivenLeaderWithoutWarriors_whenIsProtectedAt_thenLeaderIsExposed() throws NotAllowedException {
		ZoneWithLeader zone = new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, CardBuilder.buildLeader());

		assertThat(zone.isProtectedAt(ZoneWithLeader.LEADER_COORDINATE)).isFalse();
	}

	@Test
	void testGivenZoneWithLeader_whenIsLeaderSlot_thenOnlyLeaderCoordinateIsLeaderSlot() {
		ZoneWithLeader zone = new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);

		assertThat(zone.isLeaderSlot(ZoneWithLeader.LEADER_COORDINATE)).isTrue();
		assertThat(zone.isLeaderSlot(new Coordinate(1, 0))).isFalse();
	}

	@Test
	void testGivenFreeCoordinateInFirstRow_whenCanPutCombatant_thenIsTrue() {
		Zone zone = this.createZone();

		assertThat(zone.canPutCombatant(new Coordinate(FIRST_ROW, 0), CardBuilder.buildCommonWarrior())).isTrue();
	}

	@Test
	void testGivenOccupiedCoordinate_whenCanPutCombatant_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(FIRST_ROW, 0);
		zone.putCombatant(coordinate, CardBuilder.buildCommonWarrior());

		assertThat(zone.canPutCombatant(coordinate, CardBuilder.buildCommonWarrior())).isFalse();
	}

	@Test
	void testGivenCoordinateOutOfBounds_whenCanPutCombatant_thenIsFalse() {
		Zone zone = this.createZone();

		assertThat(zone.canPutCombatant(new Coordinate(VERTICAL_DIMENSION, 0), CardBuilder.buildCommonWarrior())).isFalse();
	}

	@Test
	void testGivenFirstRowNotFilled_whenCanPutCombatantInSecondRow_thenIsFalse() {
		Zone zone = this.createZone();

		assertThat(zone.canPutCombatant(new Coordinate(SECOND_ROW, 0), CardBuilder.buildCommonWarrior())).isFalse();
	}

	@Test
	void testGivenFirstRowFilled_whenCanPutCombatantInSecondRow_thenIsTrue() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();

		assertThat(zone.canPutCombatant(new Coordinate(SECOND_ROW, 0), CardBuilder.buildCommonWarrior())).isTrue();
	}

	@Test
	void testGivenZoneWithLeader_whenCanPutWarriorInLeaderSlot_thenIsFalse() {
		ZoneWithLeader zone = new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);

		assertThat(zone.canPutCombatant(ZoneWithLeader.LEADER_COORDINATE, CardBuilder.buildCommonWarrior())).isFalse();
	}

	@Test
	void testGivenZoneWithLeader_whenCanPutLeaderInLeaderSlot_thenIsTrue() {
		ZoneWithLeader zone = new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);

		assertThat(zone.canPutCombatant(ZoneWithLeader.LEADER_COORDINATE, CardBuilder.buildLeader())).isTrue();
	}

	@Test
	void testGivenZoneWithLeader_whenGetType_thenTypeIsBase() {
		ZoneWithLeader zone = new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);

		assertThat(zone.getType()).isEqualTo(new ZoneType("BASE"));
	}

	@Test
	void testGivenZoneOwnedByPlayer_whenIsEnemyOfOwner_thenIsFalse() {
		Zone zone = this.createZone();
		Player owner = new PlayerBuilder().withCode("owner").build();
		zone.setOwner(owner);

		assertThat(zone.isEnemy(owner)).isFalse();
	}

	@Test
	void testGivenZoneOwnedByPlayer_whenIsEnemyOfAnotherPlayer_thenIsTrue() {
		Zone zone = this.createZone();
		zone.setOwner(new PlayerBuilder().withCode("owner").build());

		assertThat(zone.isEnemy(new PlayerBuilder().withCode("other").build())).isTrue();
	}

	@Test
	void testGivenZoneWithoutOwner_whenIsEnemy_thenIsTrue() {
		Zone zone = this.createZone();

		assertThat(zone.isEnemy(new PlayerBuilder().withCode("player").build())).isTrue();
	}

	private Zone createZone() {
		return new DummyZone(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);
	}

	private Zone createZoneWithFirstRowFilled() throws NotAllowedException {
		Zone zone = this.createZone();
		for (int column = 0; column < HORIZONTAL_DIMENSION; column++) {
			zone.putCombatant(new Coordinate(FIRST_ROW, column), CardBuilder.buildCommonWarrior());
		}

		return zone;
	}
}
