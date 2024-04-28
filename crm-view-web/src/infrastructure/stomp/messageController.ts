import { IFrame, IMessage } from '@stomp/stompjs';
import StompClientImpl from '@/infrastructure/stomp/StompClientImpl';
import UserDto from '@/infrastructure/stomp/dto/UserDto';
import PartyDto from '@/infrastructure/stomp/dto/PartyDto';
import PartyListDto from '@/infrastructure/stomp/dto/PartyListDto';
import GameEventDto from '@/infrastructure/stomp/dto/GameEventDto';
import ErrorDto from '@/infrastructure/stomp/dto/ErrorDto';
import dtoMapper from '@/infrastructure/stomp/dtoMapper';

import { updateLocalUser } from '@/application/userService';
import { updateLocalPartyInfo, updateLocalPartyList } from '@/application/partyService';
import { processGameError, processGameEvent } from '@/application/gameService';

const onConnect = (stompClient: StompClientImpl, frame: IFrame) => {
	stompClient.subscribe('/user/topic/user/info', onUserInfoMessage);
	stompClient.subscribe('/user/topic/party/info', onPartyInfoMessage);
	stompClient.subscribe('/user/topic/party/list', onPartyListMessage);
	stompClient.subscribe('/user/topic/error', onGameErrorMessage);
	stompClient.subscribe('/user/topic/event', onGameEventMessage);
	log('Connected')
}

const onDisconnect = (stompClient: StompClientImpl, frame: IFrame) => {
	stompClient.unsubscribe('/user/topic/user/info');
	stompClient.unsubscribe('/user/topic/party/info');
	stompClient.unsubscribe('/user/topic/party/list');
	stompClient.unsubscribe('/user/topic/error');
	stompClient.unsubscribe('/user/topic/event');
	log('Disconnected')
}

const onStompError = (frame: IFrame) => {
	log('------------------------------------------------')
	log('WS: Broker reported error: ' + frame.headers['message'])
	log('WS: Additional details: ' + frame.body)
	log('------------------------------------------------')
}

function onUserInfoMessage(message: IMessage) {
	const userDto: UserDto = JSON.parse(message.body);
	updateLocalUser(dtoMapper.mapUserDtoToUser(userDto));
}

function onPartyInfoMessage(message: IMessage) {
	const partyDto: PartyDto = JSON.parse(message.body);
	updateLocalPartyInfo(dtoMapper.mapPartyDtoToParty(partyDto));
}

function onPartyListMessage(message: IMessage) {
	const partyListDto: PartyListDto = JSON.parse(message.body);
	updateLocalPartyList(dtoMapper.mapPartyListDtoToPartyList(partyListDto));
}

function onGameEventMessage(message: IMessage) {
	const gameEventDto: GameEventDto = JSON.parse(message.body);
	processGameEvent(dtoMapper.mapGameEventDtoToGameEvent(gameEventDto));
}

function onGameErrorMessage(message: IMessage) {
	const errorDto: ErrorDto = JSON.parse(message.body);
	processGameError(dtoMapper.mapErrorDtoToGameError(errorDto));
}

function log(message: string) {
    console.log(message)
}

export default {
	onConnect,
	onDisconnect,
	onStompError
}