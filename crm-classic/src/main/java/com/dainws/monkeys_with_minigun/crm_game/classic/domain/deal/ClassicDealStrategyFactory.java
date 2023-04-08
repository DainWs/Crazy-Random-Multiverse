package com.dainws.monkeys_with_minigun.crm_game.classic.domain.deal;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.ClassicCardRarity;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.ClassicCardTypes;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.DealRequest;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.DealStrategy;

public class ClassicDealStrategyFactory {

	public DealStrategy create() {
		ClassicDealStrategy dealStrategy = new ClassicDealStrategy();
		dealStrategy.setDealRequestsPerRound(0, this.generateLeader());
		dealStrategy.setDealRequestsPerRound(1, this.generateWarriorPop(2));
		dealStrategy.setDealRequestsPerRound(2, this.generateWarriorPop(1), this.generateWarriorCommon(1));
		dealStrategy.setDealRequestsPerRound(3, this.generateSpell(1));
		dealStrategy.setDealRequestsPerRound(4, this.generateWarriorRare(1));
		dealStrategy.setDealRequestsPerRound(5, this.generateSpell(1), this.generateWarriorRare(1));
		dealStrategy.setDealRequestsPerRound(6, this.generateWarriorEpic(1));
		dealStrategy.setDefaultDealRequests(this.generateSpell(1));
		return dealStrategy;
	}

	private DealRequest generateLeader() {
		return DealRequest.create(ClassicCardTypes.LEADER, ClassicCardRarity.NORMAL, 1);
	}

	private DealRequest generateSpell(int amount) {
		return DealRequest.create(ClassicCardTypes.SPELL, ClassicCardRarity.NORMAL, amount);
	}
	
	private DealRequest generateWarriorPop(int amount) {
		return DealRequest.create(ClassicCardTypes.WARRIOR, ClassicCardRarity.POP, amount);
	}
	
	private DealRequest generateWarriorCommon(int amount) {
		return DealRequest.create(ClassicCardTypes.WARRIOR, ClassicCardRarity.COMMON, amount);
	}
	
	private DealRequest generateWarriorRare(int amount) {
		return DealRequest.create(ClassicCardTypes.WARRIOR, ClassicCardRarity.RARE, amount);
	}
	
	private DealRequest generateWarriorEpic(int amount) {
		return DealRequest.create(ClassicCardTypes.WARRIOR, ClassicCardRarity.EPIC, amount);
	}
}
