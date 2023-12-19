<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SettingsService from '@/services/settings/SettingsService';
import StompMessageHandler from '@/services/stomp/StompMessageHandler';
import StompService from '@/services/stomp/StompService';

const router = useRouter()

StompMessageHandler.subscribe('PartyView', StompMessageHandler.Topics.PARTY_INFO, onPartyInfoReceived)
StompService.send(StompService.Destinations.PARTY_INFO)

const username = ref('');

SettingsService.getUsername()
  .then(value => username.value = value)

const party = ref({
  code: undefined,
  name: undefined,
  userCount: 0,
  maxUsers: 4,
  owner: undefined,
  users: []
})

function onPartyInfoReceived(data) {
  party.value = JSON.parse(data.body)
}

function leave() {
  StompService.send(StompService.Destinations.PARTY_LEAVE)
  router.back()
}

function start() {
  StompService.send(StompService.Destinations.GAME_START)
  router.push("/game")
}

</script>

<template>
  <div class="party-room">
    <div class="bg-dark text-light">
      <div class="header">
        <h1 class="title">Sala de espera</h1>
        <span class="room-name">({{ party.name }})</span>
        <div class="content-splitter"></div>
        <span class="members-count">Jugadores: {{ party.userCount }}/{{ party.maxUsers }}</span>
      </div>
      <ul class="users-list">
        <li v-for="user in party.users">
          {{ user }}
          <span class="tag" v-show="username === user">You</span>
          <span class="tag" v-show="user === party.owner">Owner</span>
        </li>
      </ul>
      <div class="footer link-menu link-menu--horizontal">
        <div class="link-menu--item secondary">
          <a class="text-decoration-none link-hover from-left" @click="leave">Salir</a>
        </div>

        <div class="link-menu--item" v-show="username === party.owner">
          <a class="text-decoration-none link-hover from-left" @click="start">Start</a>
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