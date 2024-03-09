<script setup>
import { useRouter } from 'vue-router'
import Destinations from '@/services/stomp/StompDestinations'
import StompService from '@/services/stomp/StompService'
import DataManager from '@/services/DataManager'

const router = useRouter()
const partyList = DataManager.getPartyList()

async function join(party) {
  await StompService.send(`${Destinations.PARTY_JOIN}/${party.code}`)
  router.push("/party")
}

function refresh() {
  DataManager.refresh();
}

function back() {
  
}

</script>

<template>
  <div class="party-list">
    <div class="party-list__container bg-dark text-light">
      <div class="party-list__header">
        <h1 class="title">Lista de fiestas</h1>
      </div>
      <ul class="party-list__content">
        <li v-for="party in partyList.parties">
          <span>{{ party.name }}</span>
          <div class="content-splitter"></div>
          <span class="members-count">Jugadores: {{ party.userCount }}/{{ party.maxUsers }}</span>
          <div class="button button--icon">
              <a @click="() => join(party)" v-show="party.userCount < party.maxUsers">Entrar &#10095;</a>
          </div>
        </li>
      </ul>
      <div class="party-list__footer menu menu--horizontal">
        <div class="button button--hover button--left-to-right secondary">
          <a @click="back">Salir</a>
        </div>
        <div class="button button--hover button--left-to-right">
          <a @click="refresh">Actualizar</a>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>