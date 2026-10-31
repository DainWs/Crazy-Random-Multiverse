package com.dainws.games.crm.controller.dto.domain;

import com.dainws.games.crm.domain.core.event.EventCode;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EventDto {

	@JsonProperty("code")
	private EventCode code;

	@JsonProperty("details")
	private EventDetailsDto details;

	@JsonProperty("sequence")
	private int sequence;

	public EventDto() {
	}

	public EventCode getCode() {
		return code;
	}

	public void setCode(EventCode code) {
		this.code = code;
	}

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public EventDetailsDto getDetails() {
		return details;
	}

	public void setDetails(EventDetailsDto details) {
		this.details = details;
	}
}
