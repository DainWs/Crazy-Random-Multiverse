package com.dainws.games.crm.console.services;

import com.dainws.games.cbg.domain.GameService;
import com.dainws.games.crm.console.domain.models.GameMode;

public interface AbstractGameService extends GameService {
	
	boolean supports(GameMode mode);
}
