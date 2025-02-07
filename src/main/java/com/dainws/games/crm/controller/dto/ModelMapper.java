package com.dainws.games.crm.controller.dto;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.controller.dto.domain.CardCodeDto;
import com.dainws.games.crm.controller.dto.domain.CardDto;
import com.dainws.games.crm.controller.dto.domain.GameDto;
import com.dainws.games.crm.controller.dto.domain.PartyDto;
import com.dainws.games.crm.controller.dto.domain.PartyListDto;
import com.dainws.games.crm.controller.dto.domain.PlayerDto;
import com.dainws.games.crm.controller.dto.domain.PositionDto;
import com.dainws.games.crm.controller.dto.domain.ZoneDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.player.Player;

public class ModelMapper {

	public static PartyListDto toPartyListDto(List<Party> parties) {
		List<PartyDto> partyDtos = new ArrayList<>();
		for (Party party : parties) {
			PartyDto partyDto = toPartyDto(party);
			partyDto.setUsers(new ArrayList<>());
			partyDtos.add(partyDto);
		}

		PartyListDto partyList = new PartyListDto();
		partyList.setParties(partyDtos);
		return partyList;
	}
	
	public static PartyDto toPartyDto(Party party) {
		String ownerName = party.getOwner().getName();
		
		PartyDto partyDto = new PartyDto();
		partyDto.setCode(party.getCode().text());
		partyDto.setName("Party of " + ownerName);
		partyDto.setUserCount(party.getUsers().size());
		partyDto.setOwner(ownerName);
		
		List<String> users = new ArrayList<>();
		for (User user : party.getUsers()) {
			users.add(user.getName());
		}
		partyDto.setUsers(users);

		return partyDto;
	}

	public GameDto mapGameToDto(Game game) {
		GameDto gameDto = new GameDto();
		gameDto.setCode(game.getCode().toString());
		gameDto.setPlayerWithTurn(this.mapPlayerToDto(game.getPlayerWithTurn()));

		Board board = game.getBoard();
		List<ZoneDto> playerZones = new ArrayList<>();
		for (Player player : game.getPlayers()) {
			Zone playerZone = board.getZoneOf(player);
			if (playerZone.isAlive()) {
				playerZones.add(this.mapPlayerZoneToDto(playerZone, player));
			}
		}

		gameDto.setZones(playerZones);
		return gameDto;
	}

	public ZoneDto mapPlayerZoneToDto(Zone playerZone, Player player) {
		ZoneDto zoneDto = new ZoneDto();
		zoneDto.setOwner(this.mapPlayerToDto(player));
		zoneDto.setHealth(playerZone.getZoneHealth().getValue());
		zoneDto.setMaxHealth(playerZone.getZoneHealth().getMaxValue());

		Combatant[][] combatants = playerZone.getCombatants();
		CardDto[][] combatantDtos = new CardDto[combatants.length][];
		for (int rowIndex = 0; rowIndex < combatants.length; rowIndex++) {
			combatantDtos[rowIndex] = new CardDto[combatants[rowIndex].length];
			for (int columnIndex = 0; columnIndex < combatants[rowIndex].length; columnIndex++) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				
				if (playerZone.hasCombatant(coordinate)) {
					Combatant combatant = playerZone.getCombatant(coordinate);
					combatantDtos[rowIndex][columnIndex] = this.mapCardToDto(combatant);
				}
			}
		}

		zoneDto.setCombatants(combatantDtos);
		return zoneDto;
	}

	public PlayerDto mapPlayerToDto(Player player) {
		PlayerDto playerDto = new PlayerDto();
		playerDto.setCode(player.getCode());
		playerDto.setName(player.getName());
		playerDto.setSpectator(player.isSpectator());
		playerDto.setAlive(!player.isSpectator());
		return playerDto;
	}

	public PositionDto mapCoordinateToDto(Coordinate coordinate) {
		PositionDto positionDto = new PositionDto();
		positionDto.setRow(coordinate.getRow());
		positionDto.setColumn(coordinate.getColumn());
		return positionDto;
	}
	
	public Coordinate mapDtoToCoordinate(PositionDto dto) {
		return new Coordinate(dto.getRow(), dto.getColumn());
	}

	public CardDto mapCardToDto(Card card) {
		CardDto cardDto = new CardDto();
		CardCodeDto cardCodeDto = new CardCodeDto();
		cardCodeDto.setCode(card.getCode().code());
		cardCodeDto.setType(card.getCode().type());
		cardDto.setCode(cardCodeDto);
		
		// TODO pendiente de hacer traduccion
		cardDto.setNameKey("card.%s.name".formatted(card.getCode()));
		cardDto.setDescriptionKey("card.%s.description".formatted(card.getCode()));
		cardDto.setType(card.getType());

		if (card.isType(CardType.EQUIPMENT)) {
			Equipment equipment = (Equipment) card;
			cardDto.setDamage(equipment.getDamageValue());
			cardDto.setHealth(equipment.getHealthValue());
			cardDto.setArmor(equipment.getArmorValue());
		}

		if (card.isType(CardType.WARRIOR)) {
			Warrior warrior = (Warrior) card;
			cardDto.setRarity(warrior.getRarity());
			cardDto.setDamage(warrior.getDamage().getValue());
			cardDto.setDamageType(warrior.getDamage().getType());
			cardDto.setArmor(warrior.getArmor().getValue());
			cardDto.setArmorType(warrior.getArmor().getType());
			cardDto.setHealth(warrior.getHealth().getValue());
			cardDto.setMaxHealth(warrior.getHealth().getMaxValue());
		}

		if (card.isType(CardType.LEADER)) {
			Leader leader = (Leader) card;
			cardDto.setDamage(leader.getDamage().getValue());
			cardDto.setDamageType(leader.getDamage().getType());
			cardDto.setArmor(leader.getArmor().getValue());
			cardDto.setArmorType(leader.getArmor().getType());
			cardDto.setHealth(leader.getHealth().getValue());
			cardDto.setMaxHealth(leader.getHealth().getMaxValue());
		}

		return cardDto;
	}
}
