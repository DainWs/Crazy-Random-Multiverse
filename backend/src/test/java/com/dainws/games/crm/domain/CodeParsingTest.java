package com.dainws.games.crm.domain;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.MalformedRequestException;

class CodeParsingTest {

	private static final String NOT_BASE64 = "***";
	private static final String BASE64_OF_NOT_A_UUID = "bm90LWEtdXVpZA";

	@Test
	void testGivenTextThatIsNotBase64_whenGameCodeFromBase64UrlSafe_thenThrowsMalformedRequest() {
		assertThatThrownBy(() -> GameCode.fromBase64UrlSafe(NOT_BASE64))
				.isInstanceOf(MalformedRequestException.class);
	}

	@Test
	void testGivenBase64OfAnythingButAUuid_whenGameCodeFromBase64UrlSafe_thenThrowsMalformedRequest() {
		assertThatThrownBy(() -> GameCode.fromBase64UrlSafe(BASE64_OF_NOT_A_UUID))
				.isInstanceOf(MalformedRequestException.class);
	}

	@Test
	void testGivenTextThatIsNotBase64_whenPartyCodeFromBase64UrlSafe_thenThrowsMalformedRequest() {
		assertThatThrownBy(() -> PartyCode.fromBase64UrlSafe(NOT_BASE64))
				.isInstanceOf(MalformedRequestException.class);
	}

	@Test
	void testGivenBase64OfAnythingButAUuid_whenPartyCodeFromBase64UrlSafe_thenThrowsMalformedRequest() {
		assertThatThrownBy(() -> PartyCode.fromBase64UrlSafe(BASE64_OF_NOT_A_UUID))
				.isInstanceOf(MalformedRequestException.class);
	}

	@Test
	void testGivenTextThatIsNotBase64_whenUserCodeFromBase64UrlSafe_thenThrowsMalformedRequest() {
		assertThatThrownBy(() -> UserCode.fromBase64UrlSafe(NOT_BASE64))
				.isInstanceOf(MalformedRequestException.class);
	}
}
