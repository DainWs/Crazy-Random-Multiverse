package com.dainws.games.crm.domain.core.board;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ZoneTypeTest {

	@Test
	void testGivenZoneTypesWithSameText_whenEquals_thenReturnTrue() {
		assertThat(new ZoneType("BASE")).isEqualTo(new ZoneType("BASE"));
	}

	@Test
	void testGivenZoneTypesWithDifferentText_whenEquals_thenReturnFalse() {
		assertThat(new ZoneType("BASE")).isNotEqualTo(new ZoneType("NO_LEADER"));
	}

	@Test
	void testGivenZoneTypesWithSameText_whenHashCode_thenHashCodesAreEqual() {
		assertThat(new ZoneType("BASE")).hasSameHashCodeAs(new ZoneType("BASE"));
	}
}
