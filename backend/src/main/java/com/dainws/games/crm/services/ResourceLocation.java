package com.dainws.games.crm.services;

public final class ResourceLocation {

	private static final String URL_PREFIX = "/resources/";
	private static final String CLASSPATH_PREFIX = "static/resources/";

	private ResourceLocation() {
	}

	public static String url(String path) {
		return URL_PREFIX + path;
	}

	public static String classpath(String path) {
		return CLASSPATH_PREFIX + path;
	}
}
