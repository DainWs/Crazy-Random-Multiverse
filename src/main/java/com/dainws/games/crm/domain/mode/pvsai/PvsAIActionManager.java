package com.dainws.games.crm.domain.mode.pvsai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.ActionManager;
import com.dainws.games.crm.domain.ai.action.AttackPlayerActionTemplate;
import com.dainws.games.crm.domain.ai.action.PutCardActionTemplate;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.player.Hand;

public class PvsAIActionManager implements ActionManager {

	private AIPlayer meAsAPlayer;
	private List<AIActionTemplate> aiActionTemplates;
	
	@Override
	public void applySelfAwareness(AIPlayer meAsAPlayer) {
		this.meAsAPlayer = meAsAPlayer;
	}

	@Override
	public void defineActions(Game game) {
		this.aiActionTemplates = new ArrayList<>();

		if (this.shouldDefinePutCardAction(game)) {
			System.out.println("should put card");
			this.aiActionTemplates.add(new PutCardActionTemplate());
		}

		if (this.shouldDefineAttackCardAction(game)) {
			System.out.println("should attack card");
			this.aiActionTemplates.add(new AttackPlayerActionTemplate());
		}
		
		// TODO add move action logic

		// TODO add equip card action logic
		
		// TODO add use card action logic
	}
	
	private boolean shouldDefinePutCardAction(Game game) {
		Hand hand = this.meAsAPlayer.getHand();
		boolean leaderInHand = hand.contains(CardType.LEADER);
		System.out.println("leaderInHand " + leaderInHand);
		boolean warriorsInHand = hand.contains(CardType.WARRIOR);
		System.out.println("warriorsInHand " + warriorsInHand);
		return (leaderInHand || warriorsInHand);
	}
	
	private boolean shouldDefineAttackCardAction(Game game) {
		Board board = game.getBoard();
		Zone zone = board.getZoneOf(this.meAsAPlayer);
		System.out.println("enemy zone combatants " + zone.hasCombatants());
		return zone.hasCombatants();
	}

	@Override
	public List<AIActionTemplate> getAvailableActions() {
		return this.aiActionTemplates;
	}
}
