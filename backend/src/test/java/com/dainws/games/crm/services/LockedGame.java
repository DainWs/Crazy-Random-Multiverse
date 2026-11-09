package com.dainws.games.crm.services;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.RecordingUserClient;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlayer;

/** A party locked by a game of two, where `leaver` is the second player. */
record LockedGame(PartyService service, Party party, User leaver, UserPlayer spectator, RecordingUserClient userClient) {
}
