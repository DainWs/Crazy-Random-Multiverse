package com.dainws.games.crm.domain.core.board;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.assertj.core.api.ThrowableAssert.ThrowingCallable;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;

class ZoneTest {

	private static final int HORIZONTAL_DIMENSION = 2;
	private static final int VERTICAL_DIMENSION = 2;
	private static final int FIRST_ROW = 0;
	private static final int SECOND_ROW = 1;
	private static final int FIRST_COLUMN = 0;
	private static final int SECOND_COLUMN = 1;

	@Test
	void testGivenFirstRowNotFilled_whenPutCombatantInSecondRow_thenThrowsIllegalState() {
		ThrowingCallable putCombatant = this.putInSecondRowWithFirstRowNotFilled();

		assertThatThrownBy(putCombatant).isInstanceOf(IllegalStateException.class);
	}

	@Test
	void testGivenFirstRowFilled_whenPutCombatantInSecondRow_thenCombatantIsPlaced() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate coordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();

		zone.putCombatant(coordinate, warrior);

		assertThat(zone.hasCombatant(coordinate)).isTrue();
	}

	@Test
	void testGivenCombatantWithCombatantInFrontRow_whenIsProtectedAt_thenIsProtected() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate frontCoordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior frontWarrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(frontCoordinate, frontWarrior);
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);

		assertThat(zone.isProtectedAt(coordinate)).isTrue();
	}

	@Test
	void testGivenCombatantWithEmptyFrontRow_whenIsProtectedAt_thenIsNotProtected() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);

		assertThat(zone.isProtectedAt(coordinate)).isFalse();
	}

	@Test
	void testGivenCombatantInLastRow_whenIsProtectedAt_thenIsNotProtected() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate coordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(coordinate, warrior);

		assertThat(zone.isProtectedAt(coordinate)).isFalse();
	}

	@Test
	void testGivenLeaderWithWarriorInFrontRow_whenIsProtectedAt_thenLeaderIsProtected() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate leaderCoordinate = ZoneWithLeader.LEADER_COORDINATE;
		Leader leader = CardBuilder.buildLeader();
		zone.putCombatant(leaderCoordinate, leader);
		Coordinate warriorCoordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(warriorCoordinate, warrior);

		assertThat(zone.isProtectedAt(leaderCoordinate)).isTrue();
	}

	@Test
	void testGivenLeaderWithoutWarriors_whenIsProtectedAt_thenLeaderIsExposed() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate leaderCoordinate = ZoneWithLeader.LEADER_COORDINATE;
		Leader leader = CardBuilder.buildLeader();
		zone.putCombatant(leaderCoordinate, leader);

		assertThat(zone.isProtectedAt(leaderCoordinate)).isFalse();
	}

	@Test
	void testGivenLeaderWithWarriorInFrontRow_whenIsProtectedLeaderAt_thenIsTrue() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithProtectedLeader();

		assertThat(zone.isProtectedLeaderAt(ZoneWithLeader.LEADER_COORDINATE)).isTrue();
	}

	@Test
	void testGivenProtectedWarrior_whenIsProtectedLeaderAt_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZoneWithProtectedFirstRow();

		assertThat(zone.isProtectedLeaderAt(new Coordinate(FIRST_ROW, FIRST_COLUMN))).isFalse();
	}

	@Test
	void testGivenExposedLeader_whenCanAttackFrom_thenIsTrue() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithLeader();
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, CardBuilder.buildLeader());

		assertThat(zone.canAttackFrom(ZoneWithLeader.LEADER_COORDINATE)).isTrue();
	}

	@Test
	void testGivenProtectedLeader_whenCanAttackFrom_thenIsFalse() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithProtectedLeader();

		assertThat(zone.canAttackFrom(ZoneWithLeader.LEADER_COORDINATE)).isFalse();
	}

	@Test
	void testGivenProtectedWarrior_whenCanAttackFrom_thenIsTrue() throws NotAllowedException {
		Zone zone = this.createZoneWithProtectedFirstRow();

		assertThat(zone.canAttackFrom(new Coordinate(FIRST_ROW, FIRST_COLUMN))).isTrue();
	}

	@Test
	void testGivenEmptyCoordinate_whenCanAttackFrom_thenIsFalse() {
		Zone zone = this.createZone();

		assertThat(zone.canAttackFrom(new Coordinate(FIRST_ROW, FIRST_COLUMN))).isFalse();
	}

	@Test
	void testGivenCombatantThatAlreadyAttacked_whenCanAttackFrom_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Warrior attacker = CardBuilder.buildCommonWarrior();
		zone.putCombatant(coordinate, attacker);
		CardBuilder.buildCommonWarrior().receiveDamageFrom(attacker);

		assertThat(zone.canAttackFrom(coordinate)).isFalse();
	}

	@Test
	void testGivenExposedCombatant_whenCanBeTargeted_thenIsTrue() throws NotAllowedException {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		zone.putCombatant(coordinate, CardBuilder.buildCommonWarrior());

		assertThat(zone.canBeTargeted(coordinate)).isTrue();
	}

	@Test
	void testGivenProtectedCombatant_whenCanBeTargeted_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZoneWithProtectedFirstRow();

		assertThat(zone.canBeTargeted(new Coordinate(FIRST_ROW, FIRST_COLUMN))).isFalse();
	}

	@Test
	void testGivenEmptyCoordinate_whenCanBeTargeted_thenIsFalse() {
		Zone zone = this.createZone();

		assertThat(zone.canBeTargeted(new Coordinate(FIRST_ROW, FIRST_COLUMN))).isFalse();
	}

	@Test
	void testGivenZoneWithLeader_whenIsLeaderSlot_thenLeaderCoordinateIsLeaderSlot() {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate leaderCoordinate = ZoneWithLeader.LEADER_COORDINATE;

		assertThat(zone.isLeaderSlot(leaderCoordinate)).isTrue();
	}

	@Test
	void testGivenZoneWithLeader_whenIsLeaderSlot_thenWarriorCoordinateIsNotLeaderSlot() {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate warriorCoordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);

		assertThat(zone.isLeaderSlot(warriorCoordinate)).isFalse();
	}

	@Test
	void testGivenTwoOccupiedCoordinates_whenCanSwapCombatants_thenIsTrue() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate first = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Coordinate second = new Coordinate(FIRST_ROW, SECOND_COLUMN);

		assertThat(zone.canSwapCombatants(first, second)).isTrue();
	}

	@Test
	void testGivenOneEmptyCoordinate_whenCanSwapCombatants_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate occupied = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Coordinate empty = new Coordinate(SECOND_ROW, FIRST_COLUMN);

		assertThat(zone.canSwapCombatants(occupied, empty)).isFalse();
	}

	@Test
	void testGivenSameCoordinate_whenCanSwapCombatants_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);

		assertThat(zone.canSwapCombatants(coordinate, coordinate)).isFalse();
	}

	@Test
	void testGivenZoneWithLeader_whenCanSwapWithTheLeaderSlot_thenIsFalse() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate leaderCoordinate = ZoneWithLeader.LEADER_COORDINATE;
		Coordinate warriorCoordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		zone.putCombatant(leaderCoordinate, CardBuilder.buildLeader());
		zone.putCombatant(warriorCoordinate, CardBuilder.buildCommonWarrior());

		boolean canSwap = zone.canSwapCombatants(leaderCoordinate, warriorCoordinate);

		assertThat(canSwap).isFalse();
	}

	@Test
	void testGivenTwoOccupiedCoordinates_whenSwapCombatants_thenFirstCoordinateHasTheSecondCombatant() throws NotAllowedException {
		Zone zone = this.createZone();
		Coordinate first = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Coordinate second = new Coordinate(FIRST_ROW, SECOND_COLUMN);
		Warrior firstWarrior = CardBuilder.buildCommonWarrior();
		Warrior secondWarrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(first, firstWarrior);
		zone.putCombatant(second, secondWarrior);

		zone.swapCombatants(first, second);

		assertThat(zone.getCombatant(first)).isSameAs(secondWarrior);
	}

	@Test
	void testGivenTwoOccupiedCoordinates_whenSwapCombatants_thenSecondCoordinateHasTheFirstCombatant() throws NotAllowedException {
		Zone zone = this.createZone();
		Coordinate first = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Coordinate second = new Coordinate(FIRST_ROW, SECOND_COLUMN);
		Warrior firstWarrior = CardBuilder.buildCommonWarrior();
		Warrior secondWarrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(first, firstWarrior);
		zone.putCombatant(second, secondWarrior);

		zone.swapCombatants(first, second);

		assertThat(zone.getCombatant(second)).isSameAs(firstWarrior);
	}

	@Test
	void testGivenEmptyCoordinate_whenSwapCombatants_thenThrowsIllegalState() {
		Zone zone = this.createZone();
		Coordinate first = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Coordinate second = new Coordinate(FIRST_ROW, SECOND_COLUMN);
		ThrowingCallable swap = () -> zone.swapCombatants(first, second);

		assertThatThrownBy(swap).isInstanceOf(IllegalStateException.class);
	}

	@Test
	void testGivenFreeCoordinateInFirstRow_whenCanPutCombatant_thenIsTrue() {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();

		assertThat(zone.canPutCombatant(coordinate, warrior)).isTrue();
	}

	@Test
	void testGivenOccupiedCoordinate_whenCanPutCombatant_thenIsFalse() throws NotAllowedException {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Warrior occupant = CardBuilder.buildCommonWarrior();
		zone.putCombatant(coordinate, occupant);
		Warrior warrior = CardBuilder.buildCommonWarrior();

		assertThat(zone.canPutCombatant(coordinate, warrior)).isFalse();
	}

	@Test
	void testGivenCoordinateOutOfBounds_whenCanPutCombatant_thenIsFalse() {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(VERTICAL_DIMENSION, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();

		assertThat(zone.canPutCombatant(coordinate, warrior)).isFalse();
	}

	@Test
	void testGivenFirstRowNotFilled_whenCanPutCombatantInSecondRow_thenIsFalse() {
		Zone zone = this.createZone();
		Coordinate coordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();

		assertThat(zone.canPutCombatant(coordinate, warrior)).isFalse();
	}

	@Test
	void testGivenFirstRowFilled_whenCanPutCombatantInSecondRow_thenIsTrue() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		Coordinate coordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();

		assertThat(zone.canPutCombatant(coordinate, warrior)).isTrue();
	}

	@Test
	void testGivenZoneWithLeader_whenCanPutWarriorInLeaderSlot_thenIsFalse() {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate leaderCoordinate = ZoneWithLeader.LEADER_COORDINATE;
		Warrior warrior = CardBuilder.buildCommonWarrior();

		assertThat(zone.canPutCombatant(leaderCoordinate, warrior)).isFalse();
	}

	@Test
	void testGivenZoneWithLeader_whenCanPutLeaderInLeaderSlot_thenIsTrue() {
		ZoneWithLeader zone = this.createZoneWithLeader();
		Coordinate leaderCoordinate = ZoneWithLeader.LEADER_COORDINATE;
		Leader leader = CardBuilder.buildLeader();

		assertThat(zone.canPutCombatant(leaderCoordinate, leader)).isTrue();
	}

	@Test
	void testGivenZoneWithLeader_whenGetType_thenTypeIsBase() {
		ZoneWithLeader zone = this.createZoneWithLeader();

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
		Player owner = new PlayerBuilder().withCode("owner").build();
		zone.setOwner(owner);
		Player other = new PlayerBuilder().withCode("other").build();

		assertThat(zone.isEnemy(other)).isTrue();
	}

	@Test
	void testGivenZoneWithoutOwner_whenIsEnemy_thenIsTrue() {
		Zone zone = this.createZone();
		Player player = new PlayerBuilder().withCode("player").build();

		assertThat(zone.isEnemy(player)).isTrue();
	}

	private ThrowingCallable putInSecondRowWithFirstRowNotFilled() {
		Zone zone = this.createZone();
		Coordinate firstCoordinate = new Coordinate(FIRST_ROW, FIRST_COLUMN);
		Warrior firstWarrior = CardBuilder.buildCommonWarrior();
		zone.putCombatant(firstCoordinate, firstWarrior);
		Coordinate coordinate = new Coordinate(SECOND_ROW, FIRST_COLUMN);
		Warrior warrior = CardBuilder.buildCommonWarrior();
		return () -> zone.putCombatant(coordinate, warrior);
	}

	private Zone createZone() {
		return new DummyZone(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);
	}

	private ZoneWithLeader createZoneWithLeader() {
		return new ZoneWithLeader(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);
	}

	private Zone createZoneWithFirstRowFilled() throws NotAllowedException {
		Zone zone = this.createZone();
		for (int column = 0; column < HORIZONTAL_DIMENSION; column++) {
			Coordinate coordinate = new Coordinate(FIRST_ROW, column);
			Warrior warrior = CardBuilder.buildCommonWarrior();
			zone.putCombatant(coordinate, warrior);
		}

		return zone;
	}

	private Zone createZoneWithProtectedFirstRow() throws NotAllowedException {
		Zone zone = this.createZoneWithFirstRowFilled();
		zone.putCombatant(new Coordinate(SECOND_ROW, FIRST_COLUMN), CardBuilder.buildCommonWarrior());
		return zone;
	}

	private ZoneWithLeader createZoneWithProtectedLeader() throws NotAllowedException {
		ZoneWithLeader zone = this.createZoneWithLeader();
		zone.putCombatant(ZoneWithLeader.LEADER_COORDINATE, CardBuilder.buildLeader());
		zone.putCombatant(new Coordinate(SECOND_ROW, FIRST_COLUMN), CardBuilder.buildCommonWarrior());
		return zone;
	}
}
