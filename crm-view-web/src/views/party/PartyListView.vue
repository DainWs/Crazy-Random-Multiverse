<script setup>
import { useRouter } from 'vue-router'
import Destinations from '@/services/stomp/StompDestinations'
import StompService from '@/services/stomp/StompService'
import DataManager from '@/services/DataManager'

const router = useRouter()
const partyList = DataManager.getPartyList()

DataManager.refresh()

function join(party) {
  console.log(party)
  StompService.send(Destinations.PARTY_LEAVE)
  router.push("/")
}

</script>

<template>
  <div class="party-list">
    <div class="bg-dark text-light">
      <div class="header">
        <h1 class="title">Lista de fiestas</h1>
      </div>
      <ul class="elements">
        <li class="element" v-for="party in partyList">
          <span>{{ party.name }}</span>
          <div class="content-splitter"></div>
          <span class="members-count">Jugadores: {{ party.userCount }}/{{ party.maxUsers }}</span>
          <div class="footer link-menu link-menu--horizontal" v-show="party.userCount < party.maxUsers">
            <div class="link-menu--item secondary">
              <a class="text-decoration-none link-hover from-left" @click="join.arguments(party)">Join</a>
            </div>
          </div>
        </li>
      </ul>
      <div class="footer link-menu link-menu--horizontal">
        <div class="link-menu--item secondary">
          <a class="text-decoration-none link-hover from-left" @click="leave">Salir</a>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
.party-list {
  width: 100%;
  height: 100%;

  display: flex;

  > div {
    margin: auto;
    padding: 2rem;
    width: 80%;
    height: 100%;

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
    }

    .elements {
      width: 100%;
      flex-grow: 1;

      .element {
        width: 100%;

        display: flex;
        flex-direction: row;

        .content-splitter {
          flex-grow: 1;
        }
      }

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