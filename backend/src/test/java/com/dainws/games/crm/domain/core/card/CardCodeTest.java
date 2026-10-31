package com.dainws.games.crm.domain.core.card;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class CardCodeTest {

	@Test
	void testGivenNumericText_whenFrom_thenCodeHasThatNumber() {
		CardCode cardCode = CardCode.from("42", CardType.WARRIOR);

		assertThat(cardCode).isEqualTo(new CardCode(42, CardType.WARRIOR));
	}

	@Test
	void testGivenTextWithMoreDigitsThanAnInt_whenFrom_thenCodeKeepsAllDigits() {
		CardCode cardCode = CardCode.from("9007199254740993", CardType.WARRIOR);

		assertThat(cardCode.code()).isEqualTo(9007199254740993L);
	}

	@Test
	void testGivenCardCode_whenCodeText_thenReturnsTheNumberAsText() {
		CardCode cardCode = new CardCode(9007199254740993L, CardType.WARRIOR);

		assertThat(cardCode.codeText()).isEqualTo("9007199254740993");
	}

	@Test
	void testGivenNonNumericText_whenFrom_thenThrowsNumberFormatException() {
		assertThatThrownBy(() -> CardCode.from("abc", CardType.WARRIOR))
				.isInstanceOf(NumberFormatException.class);
	}
}
