<script setup>
import { useRouter } from 'vue-router'
import Destinations from '@/services/stomp/StompDestinations'
import StompService from '@/services/stomp/StompService'
import DataManager from '@/services/DataManager'

// TODO separar logica

const router = useRouter()
const userInfo = DataManager.getUserInfo()
const partyInfo = DataManager.getPartyInfo()

function start() {
  StompService.send(Destinations.GAME_CREATE)
  router.push("/game")
}
</script>

<template>
  <div class="party">
    <div class="party__container bg-dark text-light">
      <div class="party__header">
        <h1 class="title">Sala de espera</h1>
        <span class="party-name">({{ partyInfo.name }})</span>
        <div class="content-splitter"></div>
        <span class="members-count">Jugadores: {{ partyInfo.userCount }}/{{ partyInfo.maxUsers }}</span>
      </div>
      <ul class="party__content">
        <li v-for="user in partyInfo.users">
          {{ user }} {{ userInfo.username }}
          <span class="tag" v-show="userInfo.username === user">Tú</span>
          <span class="tag" v-show="user === partyInfo.owner">Admin</span>
        </li>
      </ul>
      <div class="party__footer menu menu--horizontal">
        <div class="button button--hover button--left-to-right secondary">
          <RouterLink to="/">Salir</RouterLink>
        </div>

        <div class="button button--hover button--left-to-right" v-show="userInfo.username === partyInfo.owner">
          <a @click="start">Empezar</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@/ui/assets/styles/page/party.scss" scoped>
</style>