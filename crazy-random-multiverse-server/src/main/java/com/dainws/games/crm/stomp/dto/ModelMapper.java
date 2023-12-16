package com.dainws.games.crm.stomp.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.Zone;
import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.stomp.dto.models.CardCodeDto;
import com.dainws.games.crm.stomp.dto.models.CardDto;
import com.dainws.games.crm.stomp.dto.models.GameDto;
import com.dainws.games.crm.stomp.dto.models.PartyDto;
import com.dainws.games.crm.stomp.dto.models.PartyListDto;
import com.dainws.games.crm.stomp.dto.models.PlayerDto;
import com.dainws.games.crm.stomp.dto.models.PositionDto;
import com.dainws.games.crm.stomp.dto.models.ZoneDto;

public class ModelMapper {

	public PartyListDto mapToPartyList(List<Party> parties) {
		List<PartyDto> partyDtos = new ArrayList<>();
		for (Party party : parties) {
			PartyDto partyDto = new PartyDto();
			partyDto.setCode(party.getCode().getValue());
			partyDto.setName(party.getOwner().getName());
			partyDto.setUserCount(party.getUsers().size());
			partyDtos.add(partyDto);
		}

		PartyListDto partyList = new PartyListDto();
		partyList.setParties(partyDtos);
		return partyList;
	}

	public GameDto mapGameToDto(Game game) {
		GameDto gameDto = new GameDto();
		gameDto.setPlayerWithTurn(this.mapPlayerToDto(game.getPlayerWithTurn()));

		List<ZoneDto> playerZones = new ArrayList<>();
		for (Player player : game.getPlayers()) {
			if (player.isAlive()) {
				playerZones.add(this.mapPlayerZoneToDto(player));
			}
		}

		return gameDto;
	}

	public ZoneDto mapPlayerZoneToDto(Player player) {
		ZoneDto zoneDto = new ZoneDto();
		zoneDto.setOwner(this.mapPlayerToDto(player));

		Zone playerZone = player.getZone();
		Map<PositionDto, CardDto> positions = new HashMap<>();
		for (Entry<Position, Combatant> entry : playerZone.getPositions().entrySet()) {
			PositionDto position = this.mapPositionToDto(entry.getKey());
			CardDto card = null;

			Combatant value = entry.getValue();
			if (value != null) {
				card = this.mapCardToDto(value);
			}

			positions.put(position, card);

		}

		zoneDto.setPositions(positions);
		return zoneDto;
	}

	public PlayerDto mapPlayerToDto(Player player) {
		PlayerDto playerDto = new PlayerDto();
		playerDto.setCode(player.getCode());
		playerDto.setName(player.getName());
		return playerDto;
	}

	public PositionDto mapPositionToDto(Position position) {
		PositionDto positionDto = new PositionDto();
		positionDto.setLinePosition(position.getLinePosition());
		positionDto.setSquarePosition(position.getSquarePosition());
		return positionDto;
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
