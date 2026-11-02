package com.dainws.games.crm.controller;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.HttpInputMessage;

import com.dainws.games.crm.controller.dto.response.ExceptionCodeDto;
import com.dainws.games.crm.domain.core.exception.InvalidCodeException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.services.exception.AccessDeniedException;
import com.dainws.games.crm.services.exception.PartyException;

class RestExceptionAdviceTest {

	private final RestExceptionAdvice advice = new RestExceptionAdvice();

	@Test
	void testGivenUsecaseException_whenHandled_thenStatusIsBadRequest() {
		ResponseEntity<ExceptionCodeDto> response = this.advice.onUsecaseException(AccessDeniedException.wrongGame());

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}

	@Test
	void testGivenUsecaseException_whenHandled_thenBodyCarriesItsKey() {
		ResponseEntity<ExceptionCodeDto> response = this.advice.onUsecaseException(PartyException.userIsNotPartyOwner());

		assertThat(response.getBody().getKey()).isEqualTo("exception.party.user_is_not_party_owner");
	}

	@Test
	void testGivenNotFound_whenHandled_thenBodyCarriesItsKey() {
		ResponseEntity<ExceptionCodeDto> response = this.advice.onGameRuntimeException(NotFoundException.gameNotFound());

		assertThat(response.getBody().getKey()).isEqualTo("exception.game.not_found");
	}

	@Test
	void testGivenInvalidCode_whenHandled_thenBodyCarriesTheMalformedKey() {
		InvalidCodeException exception = new InvalidCodeException(new IllegalArgumentException());

		ResponseEntity<ExceptionCodeDto> response = this.advice.onInvalidCode(exception);

		assertThat(response.getBody().getKey()).isEqualTo("exception.request.malformed");
	}

	@Test
	void testGivenNotAllowed_whenHandled_thenBodyCarriesItsKey() {
		ResponseEntity<ExceptionCodeDto> response = this.advice.onNotAllowedException(new NotAllowedException("party.is_full"));

		assertThat(response.getBody().getKey()).isEqualTo("exception.party.is_full");
	}

	@Test
	void testGivenUnreadableBody_whenHandled_thenBodyCarriesTheMalformedKey() {
		HttpInputMessage inputMessage = null;
		HttpMessageNotReadableException exception = new HttpMessageNotReadableException("unreadable", inputMessage);

		ResponseEntity<ExceptionCodeDto> response = this.advice.onUnreadableRequest(exception);

		assertThat(response.getBody().getKey()).isEqualTo("exception.request.malformed");
	}
}
