<script setup>
import { ref, watch } from 'vue';
import ZoneComponent from '@/view/vue/components/ZoneComponent.vue';
import GameController from '@/controllers/GameController';
import Arrow from '@/view/vue/components/shared/Arrow.vue';

//const game = GameController.getGameInfo();
const playerInfo = GameController.getPlayerInfo();

const game = {
  playerWithTurn: { code: "1", name: "DainWs" },
  zones: [
  {
    owner: { code: "1", name: "DainWs" },
    combatants: [
      [null, null, null],
      [null, null, null],
      [null]
    ]
  },
  {
    owner: { code: "2", name: "Alberto" },
    combatants: [
      [null, null, null],
      [null, null, null],
      [null]
    ]
  },
  {
    owner: { code: "3", name: "Alfredo" },
    combatants: [
      [null, null, null],
      [null, null, null],
      [null]
    ]
  },
  {
    owner: { code: "4", name: "Gordi" },
    combatants: [
      [null, null, null],
      [null, null, null],
      [null]
    ]
  },
  {
    owner: { code: "5", name: "Javier" },
    combatants: [
      [null, null, null],
      [null, null, null],
      [null]
    ]
  }
]
};

const viewedPlayer = ref(game.playerWithTurn)
const viewedPlayerZone = ref(playerInfo)

function changeViewedPlayerZone(zone) {
  viewedPlayer.value = zone.owner;
  viewedPlayerZone.value = zone;
}
</script>

<template>
  <!--<div style="color: white; position: absolute; top: 0;">{{ game }}</div>-->
  <div class="game">
    <ZoneComponent :owner="viewedPlayer" :zone="viewedPlayerZone" />
    <div class="player-list">
      <div v-for="zone in game.zones" :key="zone.owner.code" class="player-item">
        <a @click="changeViewedPlayerZone(zone)">{{ zone.owner.name }}</a>
        <div v-if="zone.owner.code === game.playerWithTurn.code">
          <Arrow color="inherit" direction="left"/>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" src="@/view/assets/styles/page/game.scss">
</style>