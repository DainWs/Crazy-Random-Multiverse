<script setup>
import { ref, watch } from 'vue';
import ZoneComponent from '@/components/ZoneComponent.vue';
import GameController from '@/controllers/GameController';

const game = GameController.getGameInfo();
const playerInfo = GameController.getPlayerInfo();

const viewedPlayer = ref({})
const viewedPlayerZone = ref({})

function changeViewedPlayerZone(viewedPlayer) {
  viewedPlayerZone.value = game.value.zones.find(zone => zone.owner.code === viewedPlayer.code)
}

watch(viewedPlayer, changeViewedPlayerZone)

viewedPlayer.value = playerInfo
</script>

<template>
  <div style="color: white;">{{ game }}</div>
  <div class="game">
    <ZoneComponent :owner="viewedPlayer" :zone="viewedPlayerZone" />
    <div class="player-list"></div>
  </div>
</template>


<style lang="scss" src="@/ui/assets/styles/page/game.scss" scoped>
</style>