package com.dainws.games.crm.stomp.dto.events;

import com.dainws.games.cbg.domain.communication.EventCode;

public class EventDto {

	private EventCode code;
	private EventDetailsDto details;
	
	public EventDto() {}
	
	public EventCode getCode() {
		return code;
	}
	
	public void setCode(EventCode code) {
		this.code = code;
	}
	
	public EventDetailsDto getDetails() {
		return details;
	}
	
	public void setDetails(EventDetailsDto details) {
		this.details = details;
	}
}
