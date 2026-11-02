package com.dainws.games.crm.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.dainws.games.crm.controller.dto.response.ExceptionCodeDto;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.GameRuntimeException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.RequestExceptionCode;
import com.dainws.games.crm.services.exception.UsecaseException;

@RestControllerAdvice
public class RestExceptionAdvice {

	private final Logger logger;

	public RestExceptionAdvice() {
		this.logger = LoggerFactory.getLogger(getClass());
	}

	@ExceptionHandler(UsecaseException.class)
	public ResponseEntity<ExceptionCodeDto> onUsecaseException(UsecaseException exception) {
		return this.badRequest(exception.getCode());
	}

	@ExceptionHandler(GameRuntimeException.class)
	public ResponseEntity<ExceptionCodeDto> onGameRuntimeException(GameRuntimeException exception) {
		return this.badRequest(exception.getCode());
	}

	@ExceptionHandler(NotAllowedException.class)
	public ResponseEntity<ExceptionCodeDto> onNotAllowedException(NotAllowedException exception) {
		return this.badRequest(exception.getCode());
	}

	@ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentNotValidException.class,
			MethodArgumentTypeMismatchException.class })
	public ResponseEntity<ExceptionCodeDto> onUnreadableRequest(Exception exception) {
		this.logger.debug("Request cannot be read: {}", exception.getMessage());
		return this.badRequest(RequestExceptionCode.MALFORMED);
	}

	private ResponseEntity<ExceptionCodeDto> badRequest(ExceptionCode exceptionCode) {
		this.logger.debug("Rejecting request with {}", exceptionCode);
		return ResponseEntity.badRequest().body(new ExceptionCodeDto(exceptionCode.value()));
	}
}
