package com.dainws.games.crm.console.services;

import com.dainws.games.cbg.domain.PlayerService;
import com.dainws.games.crm.console.domain.models.GameMode;

public interface AbstractGameService extends PlayerService {
	
	boolean supports(GameMode mode);
}
