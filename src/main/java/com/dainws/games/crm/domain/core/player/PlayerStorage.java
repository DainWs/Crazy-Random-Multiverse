package com.dainws.games.crm.domain.core.player;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class PlayerStorage extends ArrayList<Player> {

	private static final long serialVersionUID = -8717689704466633308L;

	public PlayerStorage(Collection<Player> players) {
		super(players);
	}

	public PlayerStorage clone() {
		return new PlayerStorage(this);
	}

	public void replace(Player player) {
		int index = this.indexOf(player);
		this.remove(index);
		this.add(index, player);
	}

	public PlayerStorage filter(Predicate<Player> predicate) {
		List<Player> filterList = this.stream().filter(predicate).toList();

		return new PlayerStorage(filterList);
	}

	public boolean anyMatch(Predicate<Player> condition) {
		return !this.filter(condition).isEmpty();
	}

	public Player firstMatch(Predicate<Player> condition) {
		PlayerStorage filterList = this.filter(condition);
		if (filterList.isEmpty()) {
			return null;
		}

		return this.filter(condition).get(0);
	}

	public Player first() {
		if (this.isEmpty()) {
			return null;
		}

		return this.get(0);
	}

	public int countMatch(Predicate<Player> condition) {
		return this.filter(condition).size();
	}

	public boolean add(Player player) {
		if (!this.contains(player)) {
			return super.add(player);
		}

		return false;
	}

	public void addBefore(int number, Player player) {
		this.add(number - 1, player);
	}

	public void addAfter(int number, Player player) {
		this.add(number + 1, player);
	}

	@Override
	public void add(int index, Player element) {
		if (!this.contains(element)) {
			super.add(index, element);
		}
	}
	
	public List<Player> toList() {
		return this.toList(Player.class);
	}

	public <T extends Player> List<T> toList(Class<T> clazz) {
		return Stream.of(this)
				.map(player -> clazz.cast(player))
				.toList();
	}
}
