package com.dainws.games.crm.domain.models.card;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.core.card.Spell;

class SpellBuilderTest {

	Spell.Builder builder;

	@BeforeEach
	void beforeEach() {
		this.builder = new CardBuilder().useSpell()
				.withCode(0)
				.withName("test_spell_0_name")
				.withDescription("test_spell_0_description")
				.withEffect(0);
	}

	@Test
	void testGivenNoneCode_whenBuild_thenThrowNullPointerException() {
		this.builder = Spell.builder()
				.withEffect(1)
				.withName("test-spell")
				.withDescription("test-spell_description");

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNoneEffect_whenBuild_thenThrowNullPointerException() {
		this.builder = Spell.builder()
				.withCode(1)
				.withName("test-spell")
				.withDescription("test-spell_description");

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNoneName_whenBuild_thenThrowNullPointerException() {
		this.builder.withName(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenNoneDescription_whenBuild_thenThrowNullPointerException() {
		this.builder.withDescription(null);

		assertThrows(NullPointerException.class, () -> this.builder.build());
	}

	@Test
	void testGivenBuilderWithAllRequiredFields_whenBuild_thenDoNotThrowException() {
		assertDoesNotThrow(() -> this.builder.build());
	}

}
