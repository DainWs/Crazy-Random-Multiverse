<script setup>
import { useRouter } from 'vue-router'
import Destinations from '@/services/stomp/StompDestinations'
import StompService from '@/services/stomp/StompService'
import DataManager from '@/services/DataManager'

const router = useRouter()
const userInfo = DataManager.getUserInfo()
const partyInfo = DataManager.getPartyInfo()

function start() {
  StompService.send(Destinations.GAME_START)
  router.push("/game")
}
</script>

<template>
  <div class="party-room">
    <div class="bg-dark text-light">
      <div class="header">
        <h1 class="title">Sala de espera</h1>
        <span class="room-name">({{ partyInfo.name }})</span>
        <div class="content-splitter"></div>
        <span class="members-count">Jugadores: {{ partyInfo.userCount }}/{{ partyInfo.maxUsers }}</span>
      </div>
      <ul class="users-list">
        <li v-for="user in partyInfo.users">
          {{ user }}
          <span class="tag" v-show="userInfo.username === user">Tú</span>
          <span class="tag" v-show="user === partyInfo.owner">Admin</span>
        </li>
      </ul>
      <div class="footer link-menu link-menu--horizontal">
        <div class="link-menu--item secondary">
          <RouterLink to="/" class="text-decoration-none link-hover from-left">Salir</RouterLink>
        </div>

        <div class="link-menu--item" v-show="userInfo.username === partyInfo.owner">
          <a class="text-decoration-none link-hover from-left" @click="start">Empezar</a>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
.party-room {
  width: 100%;
  height: 100%;

  display: flex;

  > div {
    margin: auto;
    padding: 2rem;
    width: 60%;
    height: 80%;

    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      width: 100%;
      display: flex;
      flex-direction: row;

      .title {
        font-weight: bold;
      }

      .room-name {
        margin-left: 1rem;
        font-size: 2rem;
      }

      .content-splitter {
        flex-grow: 1;
      }

      .members-count {
        font-size: 1rem;
      }
    }

    .users-list {
      width: 100%;
      flex-grow: 1;

      .tag {
        margin: 0 .1rem;
        padding: .25rem;

        color: black;
        text-shadow: 0 0 3px white;
        background-color: rgb(255, 196, 0, 0.75);

        border-radius: 3px;
      }
    }

    .footer {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>