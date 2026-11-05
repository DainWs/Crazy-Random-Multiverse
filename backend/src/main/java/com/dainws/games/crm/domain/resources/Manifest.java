package com.dainws.games.crm.domain.resources;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import com.dainws.games.crm.domain.core.card.CardType;

public class Manifest {

	private static final String CARD_DIRECTORY = "cards/";
	private static final String KEY_SEPARATOR = ".";
	private static final String PATH_SEPARATOR = "/";
	private static final String IMAGE_EXTENSION = ".png";
	private static final String AUDIO_EXTENSION = ".mp3";
	private static final Set<CardType> TYPES_WITH_AUDIO = EnumSet.of(CardType.LEADER, CardType.WARRIOR);

	private final String urlPrefix;
	private final List<GameResource> fixed;
	private final List<GameResource> dynamic;

	public Manifest(String urlPrefix) {
		this.urlPrefix = Objects.requireNonNull(urlPrefix);
		this.fixed = new ArrayList<>();
		this.dynamic = new ArrayList<>();
	}

	public void addFixed(FixedResource resource) {
		String key = resource.getKey();
		ResourceType type = resource.getType();
		String url = this.url(resource.getPath());

		this.fixed.add(new GameResource(key, type, url));
	}

	public void addImage(String key, String path) {
		this.addDynamicResource(key, path, ResourceType.IMAGE);
	}

	public void addAudio(String key, String path) {
		this.addDynamicResource(key, path, ResourceType.AUDIO);
	}

	private void addDynamicResource(String key, String path, ResourceType type) {
		this.dynamic.add(new GameResource(key, type, this.url(path)));
	}

	public void addCard(CardResource card) {
		if (card.hasKey()) {
			this.addKeyedCard(card);
		}
	}

	private void addKeyedCard(CardResource card) {
		String key = card.getKey();
		this.addImage(key, this.cardPath(key, IMAGE_EXTENSION));
		if (TYPES_WITH_AUDIO.contains(card.getType())) {
			this.addCardAudios(key);
		}
	}

	private void addCardAudios(String cardKey) {
		for (AudioKeys audio : AudioKeys.values()) {
			for (String action : audio.getKeys()) {
				this.addCardAudio(cardKey, action);
			}
		}
	}

	private void addCardAudio(String cardKey, String action) {
		String key = cardKey + KEY_SEPARATOR + action;
		this.addAudio(key, this.cardPath(key, AUDIO_EXTENSION));
	}

	private String cardPath(String key, String extension) {
		return CARD_DIRECTORY + key.replace(KEY_SEPARATOR, PATH_SEPARATOR) + extension;
	}

	private String url(String path) {
		return this.urlPrefix + path;
	}

	public List<GameResource> getFixedResources() {
		return List.copyOf(this.fixed);
	}

	public List<GameResource> getDynamicResources() {
		return List.copyOf(this.dynamic);
	}
}
