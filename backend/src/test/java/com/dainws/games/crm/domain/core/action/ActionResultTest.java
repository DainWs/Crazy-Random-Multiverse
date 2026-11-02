package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;

class ActionResultTest {

	private static final ExceptionCode CODE = new PlayerActionExceptionCode(Code.SELECTED_CARD_NOT_FOUND);

	@Test
	void testGivenSuccessfulResult_whenIsSuccessful_thenIsTrue() {
		ActionResult result = ActionResult.successful();

		assertThat(result.isSuccessful()).isTrue();
	}

	@Test
	void testGivenSuccessfulResult_whenGetExceptionCode_thenReturnsNull() {
		ActionResult result = ActionResult.successful();

		assertThat(result.getExceptionCode()).isNull();
	}

	@Test
	void testGivenFailedResult_whenIsSuccessful_thenIsFalse() {
		ActionResult result = ActionResult.failed(CODE);

		assertThat(result.isSuccessful()).isFalse();
	}

	@Test
	void testGivenFailedResult_whenGetExceptionCode_thenReturnsTheCode() {
		ActionResult result = ActionResult.failed(CODE);

		assertThat(result.getExceptionCode()).isEqualTo(CODE);
	}

	@Test
	void testGivenNullCode_whenFailed_thenThrowsNullPointer() {
		assertThatThrownBy(() -> ActionResult.failed(null)).isInstanceOf(NullPointerException.class);
	}
}
