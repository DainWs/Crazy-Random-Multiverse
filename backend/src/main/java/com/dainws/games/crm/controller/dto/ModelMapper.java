package com.dainws.games.crm.controller.dto;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.controller.dto.response.CardDto;
import com.dainws.games.crm.controller.dto.response.GameDto;
import com.dainws.games.crm.controller.dto.response.PartyDto;
import com.dainws.games.crm.controller.dto.response.PartyListDto;
import com.dainws.games.crm.controller.dto.response.UserDto;
import com.dainws.games.crm.controller.dto.response.PlayerDto;
import com.dainws.games.crm.controller.dto.response.ZoneDto;
import com.dainws.games.crm.controller.dto.response.ZoneSlotDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
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
import com.dainws.games.crm.usecase.dto.CardCodeDto;
import com.dainws.games.crm.usecase.dto.PositionDto;

public class ModelMapper {

	public static UserDto toUserDto(User user) {
		UserDto userDto = new UserDto();
		userDto.setId(user.getCode().text());
		userDto.setUsername(user.getName());
		return userDto;
	}

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
		partyDto.setMaxUsers(party.getMaxUsers());
		partyDto.setLocked(party.isLocked());
		partyDto.setOwner(ownerName);
		
		List<String> users = new ArrayList<>();
		for (User user : party.getUsers()) {
			users.add(user.getName());
		}
		partyDto.setUsers(users);

		return partyDto;
	}

	public static GameDto mapGameToDto(Game game, Player viewer) {
		GameDto gameDto = new GameDto();
		gameDto.setCode(game.getCode().toString());
		if (game.getRoundNumber() > 0) {
			gameDto.setRound(game.getRoundNumber());
		}

		if (game.inStatus(Status.IN_PROGRESS)) {
			gameDto.setPlayerWithTurn(mapPlayerToDto(game.getPlayerWithTurn()));
		}

		Board board = game.getBoard();
		List<ZoneDto> playerZones = new ArrayList<>();
		for (Player player : game.getPlayers()) {
			Zone playerZone = board.getZoneOf(player);

			if (player.isAlive() && playerZone.isAlive()) {
				playerZones.add(mapPlayerZoneToDto(game, player, viewer));
			}
		}

		gameDto.setZones(playerZones);
		return gameDto;
	}

	public static ZoneDto mapPlayerZoneToDto(Game game, Player owner, Player viewer) {
		Zone playerZone = game.getBoard().getZoneOf(owner);
		ZoneViewpoint viewpoint = new ZoneViewpoint(game, playerZone, viewer);

		ZoneDto zoneDto = new ZoneDto();
		zoneDto.setOwner(mapPlayerToDto(owner));
		zoneDto.setType(playerZone.getType().text());

		Combatant[][] combatants = playerZone.getCombatants();
		ZoneSlotDto[][] slotDtos = new ZoneSlotDto[combatants.length][];
		for (int rowIndex = 0; rowIndex < combatants.length; rowIndex++) {
			slotDtos[rowIndex] = new ZoneSlotDto[combatants[rowIndex].length];
			for (int columnIndex = 0; columnIndex < combatants[rowIndex].length; columnIndex++) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				slotDtos[rowIndex][columnIndex] = mapSlotToDto(playerZone, coordinate, viewpoint);
			}
		}

		zoneDto.setCombatants(slotDtos);
		return zoneDto;
	}

	private static ZoneSlotDto mapSlotToDto(Zone zone, Coordinate coordinate, ZoneViewpoint viewpoint) {
		ZoneSlotDto slotDto = new ZoneSlotDto();
		slotDto.setAllowedCombatant(zone.isLeaderSlot(coordinate) ? CardType.LEADER : CardType.WARRIOR);

		if (zone.hasCombatant(coordinate)) {
			slotDto.setCombatant(mapCombatantInZoneToDto(zone, coordinate, viewpoint));
		}

		return slotDto;
	}

	private static CardDto mapCombatantInZoneToDto(Zone zone, Coordinate coordinate, ZoneViewpoint viewpoint) {
		Combatant combatant = zone.getCombatant(coordinate);
		boolean isProtected = zone.isProtectedAt(coordinate);

		CardDto cardDto = mapCardToDto(combatant);
		cardDto.setProtectedCard(isProtected);
		cardDto.setAttackAvailable(viewpoint.canAttackFrom(coordinate));
		cardDto.setTargetable(viewpoint.canTarget(coordinate));
		return cardDto;
	}

	public static PlayerDto mapPlayerToDto(Player player) {
		PlayerDto playerDto = new PlayerDto();
		playerDto.setHandSize(player.getHand().getCards().size());
		playerDto.setCode(player.getCode());
		playerDto.setName(player.getName());
		playerDto.setSpectator(player.isSpectator());
		playerDto.setAlive(player.isAlive());
		return playerDto;
	}

	public static PositionDto mapCoordinateToDto(Coordinate coordinate) {
		PositionDto positionDto = new PositionDto();
		positionDto.setRow(coordinate.getRow());
		positionDto.setColumn(coordinate.getColumn());
		return positionDto;
	}
	
	public static Coordinate mapDtoToCoordinate(PositionDto dto) {
		return new Coordinate(dto.getRow(), dto.getColumn());
	}

	public static CardDto mapCardToDto(Card card) {
		CardDto cardDto = new CardDto();
		CardCodeDto cardCodeDto = new CardCodeDto();
		cardCodeDto.setCode(card.getCode().codeText());
		cardCodeDto.setType(card.getCode().type());
		cardDto.setCatalogCode(cardCodeDto);
		
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

		if (card instanceof Combatant combatant && combatant.getEquipment() != null) {
			cardDto.setEquipment(List.of(mapCardToDto(combatant.getEquipment())));
		}

		return cardDto;
	}
}
