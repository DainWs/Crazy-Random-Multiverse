package com.dainws.games.crm.domain.ai.score;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Range;
import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.core.card.Card;

class CardScoreCalculatorTest {

	CardScoreCalculator calculator;
	
	@BeforeEach
	void beforeEach() {
		this.calculator = new CardScoreCalculator();
	}

	@Test
	void testGivenSpellCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildSpell();
		Range<Score> range = this.scoreRange(1, 2);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenEquipmentCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildEquipment();
		Range<Score> range = this.scoreRange(3, 90);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenLeaderCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildLeader();
		Range<Score> range = this.scoreRange(10, 200);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenCommonWarriorCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildCommonWarrior();
		Range<Score> range = this.scoreRange(5, 20);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenUncommonWarriorCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildUncommonWarrior();
		Range<Score> range = this.scoreRange(5, 30);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenRareWarriorCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildRareWarrior();
		Range<Score> range = this.scoreRange(10, 40);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenEpicWarriorCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildEpicWarrior();
		Range<Score> range = this.scoreRange(15, 90);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenLegendaryWarriorCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildLegendaryWarrior();
		Range<Score> range = this.scoreRange(80, 700);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}

	@Test
	void testGivenMithicWarriorCard_whenCalculateScore_thenScoreIsInRange() {
		Card card = CardBuilder.buildMithicWarrior();
		Range<Score> range = this.scoreRange(100, 1000);

		Score result = this.calculator.calculate(card);
		
		assertTrue(range.isInRange(result), "The result score was " + result);
	}
	
	private Range<Score> scoreRange(int startOfRange, int endOfRange) {
		return Range.of(Score.of(startOfRange), Score.of(endOfRange));
	}
}
