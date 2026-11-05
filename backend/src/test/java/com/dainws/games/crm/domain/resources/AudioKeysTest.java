package com.dainws.games.crm.domain.resources;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

class AudioKeysTest {

	@Test
	void testGivenAudios_whenListThem_thenTheyAreTheOnesOfTheContract() {
		assertEquals(List.of(AudioKeys.PUT, AudioKeys.DIE, AudioKeys.ATTACK), List.of(AudioKeys.values()));
	}

	@Test
	void testGivenAttack_whenGetVariants_thenThereAreThree() {
		assertEquals(3, AudioKeys.ATTACK.getVariants());
	}

	@Test
	void testGivenPutAndDie_whenGetVariants_thenThereIsOne() {
		assertEquals(List.of(1, 1), List.of(AudioKeys.PUT.getVariants(), AudioKeys.DIE.getVariants()));
	}

	@Test
	void testGivenAudioWithOneVariant_whenGetKeys_thenItIsTheBareKey() {
		assertEquals(List.of("put"), AudioKeys.PUT.getKeys());
	}

	@Test
	void testGivenAudioWithSeveralVariants_whenGetKeys_thenEachVariantIsNumbered() {
		assertEquals(List.of("attack.1", "attack.2", "attack.3"), AudioKeys.ATTACK.getKeys());
	}
}
