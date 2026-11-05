package com.dainws.games.crm.domain.resources;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

class FixedResourceTest {

	private static final String CLASSPATH_PREFIX = "static/resources/";

	@Test
	void testGivenFixedResources_whenListKeys_thenTheyAreTheOnesOfTheContract() {
		List<String> keys = Arrays.stream(FixedResource.values()).map(FixedResource::getKey).toList();

		assertEquals(List.of( //
				"icon.damage.physical", "icon.damage.magic", "icon.damage.true", //
				"icon.armor.physical", "icon.armor.magic", "icon.health", //
				"frame.common", "frame.uncommon", "frame.rare", "frame.epic", "frame.legendary", "frame.mythic", //
				"frame.leader", "frame.equipment", //
				"slot.warrior", "slot.leader", //
				"card.unknown"), keys);
	}

	@ParameterizedTest
	@EnumSource(FixedResource.class)
	void testGivenFixedResource_whenFindItInTheClasspath_thenTheFileExists(FixedResource resource) {
		String location = CLASSPATH_PREFIX + resource.getPath();

		assertNotNull(getClass().getClassLoader().getResource(location), location);
	}
}
