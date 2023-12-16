package com.dainws.games.crm.console.factories.game;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Spell;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.crm.console.domain.models.Party;
import com.dainws.games.crm.console.domain.models.User;

class ClassicGameFactory implements AbstractGameFactory {

	@Override
	public Game create(Party party) {
		return Game.builder()
			.setDeck(this.getClassicDeck())
			.setPlayers(this.getPlayersFrom(party.getUsers()))
			.build();
	}
	
	private Deck getClassicDeck() {
		Equipment gun = Equipment.builder()
				.withCode(0)
				.withName("Pistolón")
				.withDescription("Arma a distancia")
				.withDamageBuff(15)
				.build();

		return Deck.builder()
				.addCard(new Leader(0, "JaDicter", "Un lider alto y delgado"))
				.addCard(new Leader(1, "JaChin", "Un lider bajito y gordito"))

				.addCard(gun)

				.addCard(Warrior.commonWarriorBuilder()
						.withCode(0)
						.withName("Hugo")
						.withDescription("Un Humano")
						.withNoneArmor()
						.withPhysicalDamage(5)
						.withHealth(5)
						.build())
				.addCard(Warrior.uncommonWarriorBuilder()
						.withCode(1)
						.withName("Toby")
						.withDescription("Un perro fiel, pero tranquilo")
						.withNoneArmor()
						.withPhysicalDamage(10)
						.withHealth(10)
						.build())
				.addCard(Warrior.uncommonWarriorBuilder()
						.withCode(2)
						.withName("Policía")
						.withDescription("Un Humano que se encarga de mantener el orden")
						.withNoneArmor()
						.withPhysicalDamage(5)
						.withHealth(10)
						.withEquipment(gun)
						.build())
				.addCard(Warrior.commonWarriorBuilder()
						.withCode(3)
						.withName("Jose")
						.withDescription("Un Humano")
						.withNoneArmor()
						.withPhysicalDamage(5)
						.withHealth(15)
						.build())

				.addCard(Spell.builder()
						.withCode(0)
						.withName("Cartas")
						.withDescription("Recibes 1 carta común")
						.withEffect(1)
						.build())
				.addCard(Spell.builder()
						.withCode(1)
						.withName("Cartas")
						.withDescription("Recibes 1 carta poco común")
						.withEffect(2)
						.build())

				.build();
	}
	
	private List<Player> getPlayersFrom(List<User> users) {
		List<Player> players = new ArrayList<>();
		for (User user : users) {
			Player player = Player.builder()
					.withPlayerCode(user.getUserCode().toString())
					.withName(user.getName())
					.build();

			players.add(player);
		}

		return players;
	}

}
