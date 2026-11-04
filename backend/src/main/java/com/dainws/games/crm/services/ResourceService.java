package com.dainws.games.crm.services;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.repositories.CardRepository;
import com.dainws.games.crm.domain.repositories.GameRepository;
import com.dainws.games.crm.services.exception.AccessDeniedException;

@Service
public class ResourceService {

	private static final String CARD_DIRECTORY = "cards/";
	private static final String KEY_SEPARATOR = ".";
	private static final String PATH_SEPARATOR = "/";
	private static final String IMAGE_EXTENSION = ".png";
	private static final String AUDIO_EXTENSION = ".mp3";
	private static final String PUT_AUDIO = "put";
	private static final String DIE_AUDIO = "die";
	private static final String ATTACK_AUDIO = "attack";
	private static final int ATTACK_AUDIO_VARIANTS = 3;
	private static final Set<CardType> TYPES_WITH_AUDIO = EnumSet.of(CardType.LEADER, CardType.WARRIOR);

	private GameRepository gameRepository;
	private CardRepository cardRepository;
	private Map<CardType, Function<Card, String>> imageKeyResolver;

	public ResourceService(GameRepository gameRepository, CardRepository cardRepository) {
		this.gameRepository = gameRepository;
		this.cardRepository = cardRepository;
		this.imageKeyResolver = new EnumMap<>(CardType.class);
		this.imageKeyResolver.put(CardType.LEADER, this::leaderKey);
		this.imageKeyResolver.put(CardType.WARRIOR, this::warriorKey);
		this.imageKeyResolver.put(CardType.EQUIPMENT, this::equipmentKey);
	}

	public ResourceManifest getManifest(GameCode gameCode, PlayerCode playerCode) {
		Game game = this.gameRepository.find(gameCode);
		if (game.getPlayer(playerCode) == null) {
			throw AccessDeniedException.wrongGame();
		}

		return new ResourceManifest(this.fixedResources(), this.dynamicResources());
	}

	private List<GameResource> fixedResources() {
		List<GameResource> resources = new ArrayList<>();
		for (FixedResource fixedResource : FixedResource.values()) {
			String url = ResourceLocation.url(fixedResource.path());
			resources.add(new GameResource(fixedResource.key(), ResourceType.IMAGE, url));
		}
		return resources;
	}

	private List<GameResource> dynamicResources() {
		List<GameResource> resources = new ArrayList<>();
		for (Card card : this.cardRepository.findAll()) {
			if (!this.imageKeyResolver.containsKey(card.getType())) {
				continue;
			}

			String imageKey = this.imageKeyResolver.get(card.getType()).apply(card);
			resources.add(this.resource(imageKey, ResourceType.IMAGE, IMAGE_EXTENSION));
			if (TYPES_WITH_AUDIO.contains(card.getType())) {
				resources.addAll(this.audioResources(imageKey));
			}
		}
		return resources;
	}

	private List<GameResource> audioResources(String imageKey) {
		List<GameResource> resources = new ArrayList<>();
		resources.add(this.audioResource(imageKey, PUT_AUDIO));
		resources.add(this.audioResource(imageKey, DIE_AUDIO));
		for (int variant = 1; variant <= ATTACK_AUDIO_VARIANTS; variant++) {
			resources.add(this.audioResource(imageKey, ATTACK_AUDIO + KEY_SEPARATOR + variant));
		}
		return resources;
	}

	private GameResource audioResource(String imageKey, String action) {
		return this.resource(imageKey + KEY_SEPARATOR + action, ResourceType.AUDIO, AUDIO_EXTENSION);
	}

	private GameResource resource(String key, ResourceType type, String extension) {
		String path = CARD_DIRECTORY + key.replace(KEY_SEPARATOR, PATH_SEPARATOR) + extension;
		return new GameResource(key, type, ResourceLocation.url(path));
	}

	private String leaderKey(Card card) {
		return "leader" + KEY_SEPARATOR + card.getCode().codeText();
	}

	private String warriorKey(Card card) {
		String rarity = ((Warrior) card).getRarity().name().toLowerCase();
		return "warrior" + KEY_SEPARATOR + rarity + KEY_SEPARATOR + card.getCode().codeText();
	}

	private String equipmentKey(Card card) {
		return "equipment" + KEY_SEPARATOR + card.getCode().codeText();
	}
}
