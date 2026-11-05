package com.dainws.games.crm.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.resources.FixedResource;
import com.dainws.games.crm.domain.resources.GameResource;
import com.dainws.games.crm.domain.resources.Manifest;
import com.dainws.games.crm.domain.resources.ResourceType;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.services.exception.AccessDeniedException;

class LoadUsecaseTest {

	private static final String URL_PREFIX = "/resources/";
	private static final String MEMBER_CODE = "player-1";
	private static final String SPECTATOR_CODE = "spectator-1";

	MemoryCardRepository cardRepository;
	MemoryGameRepository gameRepository;
	LoadUsecase loadUsecase;
	Game game;

	@BeforeEach
	void beforeEach() {
		this.cardRepository = new MemoryCardRepository();
		this.cardRepository.set(new Leader(0));
		this.cardRepository.set(Warrior.rareWarriorBuilder() //
				.withCode(4) //
				.withNoneArmor() //
				.withPhysicalDamage(5) //
				.withHealth(5) //
				.build());
		this.cardRepository.set(Equipment.builder().withCode(1).withDamageBuff(5).build());
		this.cardRepository.set(Spell.newInstance(0l, 1l));

		this.game = new GameBuilder() //
				.withPlayers(new PlayerBuilder().withCode(MEMBER_CODE).build(),
						new PlayerBuilder().withCode(SPECTATOR_CODE).withSpectator(true).build()) //
				.build();
		this.gameRepository = new MemoryGameRepository();
		this.gameRepository.save(this.game);

		this.loadUsecase = new LoadUsecase(this.gameRepository, this.cardRepository);
		this.loadUsecase.setResourcesUrlPrefix(URL_PREFIX);
	}

	@Test
	void testGivenPlayerOfTheGame_whenGetManifest_thenFixedListsEveryFixedResource() {
		Manifest manifest = this.getManifest();

		List<String> expected = Arrays.stream(FixedResource.values()).map(FixedResource::getKey).toList();
		assertEquals(expected, manifest.getFixedResources().stream().map(GameResource::getKey).toList());
	}

	@Test
	void testGivenCardsInTheRepository_whenGetManifest_thenDynamicListsTheOnesWithResources() {
		Manifest manifest = this.getManifest();

		List<String> imageKeys = manifest.getDynamicResources().stream() //
				.filter(resource -> resource.getType() == ResourceType.IMAGE) //
				.map(GameResource::getKey) //
				.sorted() //
				.toList();
		assertEquals(List.of("equipment.1", "leader.0", "warrior.rare.4"), imageKeys);
	}

	@Test
	void testGivenUrlPrefix_whenGetManifest_thenResourcesUseIt() {
		this.loadUsecase.setResourcesUrlPrefix("/other/");

		Manifest manifest = this.getManifest();

		assertEquals("/other/icons/damage-physical.png", manifest.getFixedResources().get(0).getUrl());
	}

	@Test
	void testGivenSpectatorOfTheGame_whenGetManifest_thenTheyGetTheManifest() {
		Manifest manifest = this.loadUsecase.getManifest(this.game.getCode(), PlayerCode.from(SPECTATOR_CODE));

		assertFalse(manifest.getFixedResources().isEmpty());
	}

	@Test
	void testGivenGameThatDoesNotExist_whenGetManifest_thenThrowNotFound() {
		GameCode otherGame = new GameCode();
		PlayerCode member = PlayerCode.from(MEMBER_CODE);

		assertThrows(NotFoundException.class, () -> this.loadUsecase.getManifest(otherGame, member));
	}

	@Test
	void testGivenPlayerOutsideTheGame_whenGetManifest_thenThrowAccessDenied() {
		GameCode gameCode = this.game.getCode();
		PlayerCode outsider = PlayerCode.from("outsider");

		assertThrows(AccessDeniedException.class, () -> this.loadUsecase.getManifest(gameCode, outsider));
	}

	private Manifest getManifest() {
		return this.loadUsecase.getManifest(this.game.getCode(), PlayerCode.from(MEMBER_CODE));
	}
}
