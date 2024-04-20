package com.dainws.games.crm.controller.dto;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.board.Coordinate;
import com.dainws.games.cbg.domain.board.Zone;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.crm.controller.dto.models.CardCodeDto;
import com.dainws.games.crm.controller.dto.models.CardDto;
import com.dainws.games.crm.controller.dto.models.GameDto;
import com.dainws.games.crm.controller.dto.models.PartyDto;
import com.dainws.games.crm.controller.dto.models.PartyListDto;
import com.dainws.games.crm.controller.dto.models.PlayerDto;
import com.dainws.games.crm.controller.dto.models.PositionDto;
import com.dainws.games.crm.controller.dto.models.ZoneDto;
import com.dainws.games.crm.domain.model.Party;
import com.dainws.games.crm.domain.model.User;

public class ModelMapper {

	public PartyListDto mapPartiesToPartyList(List<Party> parties) {
		List<PartyDto> partyDtos = new ArrayList<>();
		for (Party party : parties) {
			PartyDto partyDto = this.mapPartyToPartyDto(party);
			partyDto.setUsers(new ArrayList<>());
			partyDtos.add(partyDto);
		}

		PartyListDto partyList = new PartyListDto();
		partyList.setParties(partyDtos);
		return partyList;
	}
	
	public PartyDto mapPartyToPartyDto(Party party) {
		String ownerName = party.getOwner().getName();
		
		PartyDto partyDto = new PartyDto();
		partyDto.setCode(party.getCode().getValue());
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
			Zone playerZone = board.getZone(player);
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
		
		int verticalDimension = playerZone.getVerticalDimension();
		int horizontalDimension = playerZone.getHorizontalDimension();

		CardDto[][] combatantDtos = new CardDto[verticalDimension][horizontalDimension]; 
		for (int rowIndex = 0; rowIndex < verticalDimension; rowIndex++) {
			for (int columnIndex = 0; columnIndex < horizontalDimension; columnIndex++) {
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
		cardCodeDto.setCode(card.getCode().getCode());
		cardCodeDto.setType(card.getCode().getType());
		cardDto.setCode(cardCodeDto);
		cardDto.setNameKey(card.getName().getKey().getValue());
		cardDto.setDescriptionKey(card.getDescription().getKey().getValue());
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
