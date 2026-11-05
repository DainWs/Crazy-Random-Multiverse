package com.dainws.games.crm.domain.resources;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

class ManifestTest {

	private static final String URL_PREFIX = "/resources/";

	Manifest manifest;

	@BeforeEach
	void beforeEach() {
		this.manifest = new Manifest(URL_PREFIX);
	}

	@Test
	void testGivenFixedResource_whenAddFixed_thenItIsAnImageWithUrlRelativeToTheServer() {
		this.manifest.addFixed(FixedResource.ICON_HEALTH);

		assertEquals(List.of(new GameResource("icon.health", ResourceType.IMAGE, "/resources/icons/health.png")),
				this.manifest.getFixedResources());
	}

	@Test
	void testGivenFixedResource_whenAddFixed_thenDynamicStaysEmpty() {
		this.manifest.addFixed(FixedResource.ICON_HEALTH);

		assertTrue(this.manifest.getDynamicResources().isEmpty());
	}

	@Test
	void testGivenImage_whenAddImage_thenDynamicListsItWithTheUrlPrefix() {
		this.manifest.addImage("some.key", "some/path.png");

		assertEquals(List.of(new GameResource("some.key", ResourceType.IMAGE, "/resources/some/path.png")),
				this.manifest.getDynamicResources());
	}

	@Test
	void testGivenAudio_whenAddAudio_thenDynamicListsItWithTheUrlPrefix() {
		this.manifest.addAudio("some.key", "some/path.mp3");

		assertEquals(List.of(new GameResource("some.key", ResourceType.AUDIO, "/resources/some/path.mp3")),
				this.manifest.getDynamicResources());
	}

	@Test
	void testGivenWarrior_whenAddCard_thenDynamicListsItsImage() {
		this.manifest.addCard(this.warrior());

		GameResource image = this.find("warrior.rare.4");
		assertEquals(new GameResource("warrior.rare.4", ResourceType.IMAGE, "/resources/cards/warrior/rare/4.png"), image);
	}

	@Test
	void testGivenWarrior_whenAddCard_thenDynamicListsItsPutAudio() {
		this.manifest.addCard(this.warrior());

		GameResource audio = this.find("warrior.rare.4.put");
		assertEquals(new GameResource("warrior.rare.4.put", ResourceType.AUDIO, "/resources/cards/warrior/rare/4/put.mp3"),
				audio);
	}

	@Test
	void testGivenWarrior_whenAddCard_thenDynamicListsItsDieAudio() {
		this.manifest.addCard(this.warrior());

		GameResource audio = this.find("warrior.rare.4.die");
		assertEquals(new GameResource("warrior.rare.4.die", ResourceType.AUDIO, "/resources/cards/warrior/rare/4/die.mp3"),
				audio);
	}

	@Test
	void testGivenWarrior_whenAddCard_thenDynamicListsThreeAttackAudios() {
		this.manifest.addCard(this.warrior());

		List<String> attackKeys = this.keys().stream() //
				.filter(key -> key.startsWith("warrior.rare.4.attack.")) //
				.toList();
		assertEquals(List.of("warrior.rare.4.attack.1", "warrior.rare.4.attack.2", "warrior.rare.4.attack.3"), attackKeys);
	}

	@Test
	void testGivenLeader_whenAddCard_thenDynamicListsItsImage() {
		this.manifest.addCard(new CardResource(new CardCode(0, CardType.LEADER)));

		GameResource image = this.find("leader.0");
		assertEquals(new GameResource("leader.0", ResourceType.IMAGE, "/resources/cards/leader/0.png"), image);
	}

	@Test
	void testGivenLeader_whenAddCard_thenDynamicListsItsPutAudio() {
		this.manifest.addCard(new CardResource(new CardCode(0, CardType.LEADER)));

		GameResource audio = this.find("leader.0.put");
		assertEquals(new GameResource("leader.0.put", ResourceType.AUDIO, "/resources/cards/leader/0/put.mp3"), audio);
	}

	@Test
	void testGivenEquipment_whenAddCard_thenDynamicListsItsImage() {
		this.manifest.addCard(new CardResource(new CardCode(1, CardType.EQUIPMENT)));

		GameResource image = this.find("equipment.1");
		assertEquals(new GameResource("equipment.1", ResourceType.IMAGE, "/resources/cards/equipment/1.png"), image);
	}

	@Test
	void testGivenEquipment_whenAddCard_thenDynamicListsNoAudioOfIt() {
		this.manifest.addCard(new CardResource(new CardCode(1, CardType.EQUIPMENT)));

		assertEquals(List.of("equipment.1"), this.keys());
	}

	@Test
	void testGivenSpell_whenAddCard_thenDynamicListsNothingOfIt() {
		this.manifest.addCard(new CardResource(new CardCode(0, CardType.SPELL)));

		assertTrue(this.manifest.getDynamicResources().isEmpty());
	}

	@Test
	void testGivenManifest_whenAddAfterReadingFixed_thenTheReadListDoesNotChange() {
		List<GameResource> fixed = this.manifest.getFixedResources();

		this.manifest.addFixed(FixedResource.ICON_HEALTH);

		assertFalse(fixed.contains(new GameResource("icon.health", ResourceType.IMAGE, "/resources/icons/health.png")));
	}

	@Test
	void testGivenManifest_whenModifyTheReadDynamic_thenThrowUnsupported() {
		List<GameResource> dynamic = this.manifest.getDynamicResources();
		GameResource resource = new GameResource("key", ResourceType.IMAGE, "url");

		assertThrows(UnsupportedOperationException.class, () -> dynamic.add(resource));
	}

	private CardResource warrior() {
		CardResource warrior = new CardResource(new CardCode(4, CardType.WARRIOR));
		warrior.setRarity(WarriorRarity.RARE);
		return warrior;
	}

	private List<String> keys() {
		return this.manifest.getDynamicResources().stream().map(GameResource::getKey).toList();
	}

	private GameResource find(String key) {
		List<GameResource> matches = this.manifest.getDynamicResources().stream().filter(resource -> resource.getKey().equals(key)).toList();
		assertTrue(matches.size() == 1, "Expected one resource with key " + key + " but found " + matches.size());
		return matches.get(0);
	}
}
