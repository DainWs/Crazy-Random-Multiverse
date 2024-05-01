import GameCode from '@/domain/models/GameCode';
import PartyCode from '@/domain/models/PartyCode';
import User from '@/domain/models/User';
import Action from '@/domain/actions/Action';

import IClient from '@api/IClient';
import dtoMapper from '@api/dtoMapper';

const APPLICATION_ENDPOINT = `/application`;
const USER_ENDPOINT = `${APPLICATION_ENDPOINT}/user`;
const PARTY_ENDPOINT = `${APPLICATION_ENDPOINT}/party`;
const GAME_ENDPOINT = `${APPLICATION_ENDPOINT}/game`;

let client: IClient;

/**
 * **IMPROTANTE!!** Use setClient solo con propositos de configuración al inicio de la aplicación
 */
const setClient = (clientImpl: IClient) => {
  client = clientImpl;
};

const sendRefreshUserInfo = async () => {
  await client.send(`${USER_ENDPOINT}/info`);
};

const sendUpdateUserInfo = async (user: User) => {
  const userDto = dtoMapper.mapUserToDto(user);
  await client.send(`${USER_ENDPOINT}/update`, userDto);
};

const sendRefreshPartyList = async () => {
  await client.send(`${PARTY_ENDPOINT}/list`);
};

const sendRefreshPartyInfo = async () => {
  await client.send(`${PARTY_ENDPOINT}/info`);
};

const sendCreateParty = async () => {
  await client.send(`${PARTY_ENDPOINT}/create`);
};

const sendJoinParty = async (partyCode: PartyCode) => {
  await client.send(`${PARTY_ENDPOINT}/join/${partyCode}`);
};

const sendLeaveParty = async () => {
  await client.send(`${PARTY_ENDPOINT}/leave`);
};

const sendCreateGame = async () => {
  await client.send(`${GAME_ENDPOINT}/create`);
};

const sendReadyToPlay = async (gameCode: GameCode) => {
  await client.send(`${GAME_ENDPOINT}/${gameCode}/ready`);
};

const sendAction = async (gameCode: GameCode, action: Action) => {
  const actionDto = dtoMapper.mapActionToDto(action);
  await client.send(`${GAME_ENDPOINT}/${gameCode}/action`, actionDto);
};

// CONFIGURATION ACCESS ONLY
export {setClient};

// PUBLIC ACCESS
export {
  sendRefreshUserInfo,
  sendUpdateUserInfo,
  sendRefreshPartyList,
  sendRefreshPartyInfo,
  sendCreateParty,
  sendJoinParty,
  sendLeaveParty,
  sendCreateGame,
  sendReadyToPlay,
  sendAction
};
