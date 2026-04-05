package com.dainws.games.crm.domain.mode;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.mode.classic.ClassicModeStrategy;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGameStrategy;

public class GameModes {
	public static final GameMode CLASSIC = ClassicModeStrategy.CLASSIC_MODE;

	public static final GameMode PLAYER_VS_AI = PvsAIGameStrategy.PVSAI_MODE;
}
