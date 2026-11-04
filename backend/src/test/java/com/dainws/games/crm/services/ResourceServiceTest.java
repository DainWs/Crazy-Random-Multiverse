package com.dainws.games.crm.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.services.exception.AccessDeniedException;

class ResourceServiceTest {

	private static final String MEMBER_CODE = "player-1";
	private static final String SPECTATOR_CODE = "spectator-1";

	MemoryCardRepository cardRepository;
	MemoryGameRepository gameRepository;
	ResourceService resourceService;
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

		this.resourceService = new ResourceService(this.gameRepository, this.cardRepository);
	}

	@Test
	void testGivenPlayerOfTheGame_whenGetManifest_thenFixedListsEveryFixedResource() {
		ResourceManifest manifest = this.getManifest();

		List<String> expected = Arrays.stream(FixedResource.values()).map(FixedResource::key).toList();
		assertEquals(expected, this.keysOf(manifest.fixed()));
	}

	@Test
	void testGivenPlayerOfTheGame_whenGetManifest_thenFixedResourceIsAnImageWithUrlRelativeToTheServer() {
		ResourceManifest manifest = this.getManifest();

		GameResource health = this.find(manifest.fixed(), "icon.health");
		assertEquals(new GameResource("icon.health", ResourceType.IMAGE, "/resources/icons/health.png"), health);
	}

	@Test
	void testGivenWarrior_whenGetManifest_thenDynamicListsItsImage() {
		ResourceManifest manifest = this.getManifest();

		GameResource image = this.find(manifest.dynamic(), "warrior.rare.4");
		assertEquals(new GameResource("warrior.rare.4", ResourceType.IMAGE, "/resources/cards/warrior/rare/4.png"), image);
	}

	@Test
	void testGivenWarrior_whenGetManifest_thenDynamicListsItsPutAudio() {
		ResourceManifest manifest = this.getManifest();

		GameResource audio = this.find(manifest.dynamic(), "warrior.rare.4.put");
		assertEquals(new GameResource("warrior.rare.4.put", ResourceType.AUDIO, "/resources/cards/warrior/rare/4/put.mp3"),
				audio);
	}

	@Test
	void testGivenWarrior_whenGetManifest_thenDynamicListsItsDieAudio() {
		ResourceManifest manifest = this.getManifest();

		GameResource audio = this.find(manifest.dynamic(), "warrior.rare.4.die");
		assertEquals(new GameResource("warrior.rare.4.die", ResourceType.AUDIO, "/resources/cards/warrior/rare/4/die.mp3"),
				audio);
	}

	@Test
	void testGivenWarrior_whenGetManifest_thenDynamicListsThreeAttackAudios() {
		ResourceManifest manifest = this.getManifest();

		List<String> attackKeys = this.keysOf(manifest.dynamic()).stream() //
				.filter(key -> key.startsWith("warrior.rare.4.attack.")) //
				.toList();
		assertEquals(List.of("warrior.rare.4.attack.1", "warrior.rare.4.attack.2", "warrior.rare.4.attack.3"), attackKeys);
	}

	@Test
	void testGivenLeader_whenGetManifest_thenDynamicListsItsImage() {
		ResourceManifest manifest = this.getManifest();

		GameResource image = this.find(manifest.dynamic(), "leader.0");
		assertEquals(new GameResource("leader.0", ResourceType.IMAGE, "/resources/cards/leader/0.png"), image);
	}

	@Test
	void testGivenLeader_whenGetManifest_thenDynamicListsItsPutAudio() {
		ResourceManifest manifest = this.getManifest();

		GameResource audio = this.find(manifest.dynamic(), "leader.0.put");
		assertEquals(new GameResource("leader.0.put", ResourceType.AUDIO, "/resources/cards/leader/0/put.mp3"), audio);
	}

	@Test
	void testGivenEquipment_whenGetManifest_thenDynamicListsItsImage() {
		ResourceManifest manifest = this.getManifest();

		GameResource image = this.find(manifest.dynamic(), "equipment.1");
		assertEquals(new GameResource("equipment.1", ResourceType.IMAGE, "/resources/cards/equipment/1.png"), image);
	}

	@Test
	void testGivenEquipment_whenGetManifest_thenDynamicListsNoAudioOfIt() {
		ResourceManifest manifest = this.getManifest();

		boolean hasAudio = this.keysOf(manifest.dynamic()).stream().anyMatch(key -> key.startsWith("equipment.1."));
		assertFalse(hasAudio);
	}

	@Test
	void testGivenSpell_whenGetManifest_thenDynamicListsNothingOfIt() {
		ResourceManifest manifest = this.getManifest();

		boolean hasSpell = this.keysOf(manifest.dynamic()).stream().anyMatch(key -> key.startsWith("spell"));
		assertFalse(hasSpell);
	}

	@Test
	void testGivenSpectatorOfTheGame_whenGetManifest_thenTheyGetTheManifest() {
		ResourceManifest manifest = this.resourceService.getManifest(this.game.getCode(), PlayerCode.from(SPECTATOR_CODE));

		assertFalse(manifest.fixed().isEmpty());
	}

	@Test
	void testGivenGameThatDoesNotExist_whenGetManifest_thenThrowNotFound() {
		GameCode otherGame = new GameCode();
		PlayerCode member = PlayerCode.from(MEMBER_CODE);

		assertThrows(NotFoundException.class, () -> this.resourceService.getManifest(otherGame, member));
	}

	@Test
	void testGivenPlayerOutsideTheGame_whenGetManifest_thenThrowAccessDenied() {
		GameCode gameCode = this.game.getCode();
		PlayerCode outsider = PlayerCode.from("outsider");

		assertThrows(AccessDeniedException.class, () -> this.resourceService.getManifest(gameCode, outsider));
	}

	private ResourceManifest getManifest() {
		return this.resourceService.getManifest(this.game.getCode(), PlayerCode.from(MEMBER_CODE));
	}

	private List<String> keysOf(List<GameResource> resources) {
		return resources.stream().map(GameResource::key).toList();
	}

	private GameResource find(List<GameResource> resources, String key) {
		List<GameResource> matches = resources.stream().filter(resource -> resource.key().equals(key)).toList();
		assertTrue(matches.size() == 1, "Expected one resource with key " + key + " but found " + matches.size());
		return matches.get(0);
	}
}
