import { ref } from 'vue';
import { defineStore } from 'pinia'

import Party from "@/domain/models/Party";
import PartyCode from "@/domain/models/PartyCode";
import { GameMode } from "@/domain/models/Game";

import { createParty, getPartyList, joinParty, leaveParty, startGame, updateParty } from "@/api/v1"

import useSessionStore from '@/stores/SessionStore';

const usePartyStore = defineStore('party', initialize);

function initialize() {
  const session = useSessionStore();
  const currentParty = ref<Party | null>(null);
  const allParties = ref<Party[]>([]);

  const refreshPartyList = async () => {
    const parties = await getPartyList();
    allParties.value = parties;
  }

  const createOwnParty = async (gameMode: GameMode, maxPlayers: number) => {
    const party = await createParty({ gameMode, maxPlayers });
    currentParty.value = party;
  }

  const updatePartyInfo = async (gameMode: GameMode, maxPlayers: number) => {
    requireToBeTheOwnerOfTheParty();

    const partyCode = currentParty.value?.code ?? '';
    await updateParty({ partyCode, gameMode, maxPlayers });

    if (currentParty.value) {
      currentParty.value.gameMode = gameMode;
      currentParty.value.maxUsers = maxPlayers;
    }
  }

  const startPartyGame = async () => {
    requireToBeTheOwnerOfTheParty();

    const partyCode = currentParty.value?.code ?? '';
    await startGame({ partyCode })
  }

  const joinToParty = async (partyCode: PartyCode) => {
    const party = await joinParty({ partyCode });
    currentParty.value = party;
  }

  const leaveFromParty = async () => {
    requireToBeInParty();

    const partyCode = currentParty.value?.code ?? '';
    await leaveParty({ partyCode });
    currentParty.value = null;
  }

  function requireToBeTheOwnerOfTheParty() {
    requireToBeInParty();

    const ownerUsername = currentParty.value?.owner;
    const myUsername = session.currentUser.username;
    if (ownerUsername != myUsername) throw new Error("This action requires being the owner of the party");
  }

  function requireToBeInParty() {
    if (!currentParty.value) throw new Error("This action requires being at a party");
  }

  return {
    currentParty,
    allParties,

    refreshPartyList,
    createOwnParty,
    updatePartyInfo,
    startPartyGame,
    joinToParty,
    leaveFromParty
  };
}

export default usePartyStore;