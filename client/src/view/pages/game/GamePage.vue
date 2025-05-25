<script lang="ts" setup>
import Zone from '@/domain/models/Zone';
import ZoneView from '@pages/game/zone/ZoneView.vue';
import ZoneNavigator from '@pages/game/zone/ZoneNavigator.vue';
import PlayerHand from '@pages/game/hand/PlayerHand.vue';
import useGameController from '@pages/game/useGameController';
import AppButton from '@components/shared/AppButton.vue';

const gameController = useGameController();

const game = gameController.getReactiveGame();
const playerInfo = gameController.getReactivePlayerInfo();
const playerHand = gameController.getReactivePlayerHand();
const visibleZone = gameController.getReactiveVisibleZone();
const onPassTurn = gameController.passTurn;
const onZoneSelect = gameController.onZoneSelect;

console.log(game)
console.log(playerInfo)
console.log(playerHand)
console.log(visibleZone)
</script>

<template>
  <!--<div style="color: white; position: absolute; top: 0;">{{ game }}</div>-->
  <div class="game">
    <AppButton tabindex="1" style="position: absolute;top: 0; left: 0;" text="Pass turn" @click="onPassTurn" />
    <!-- TODO Agregar e implementar componente ErrorMessagesComponent -->

    <!-- TODO Agregar enemy zone preview -->
    <ZoneView v-if="visibleZone" :is-enemy-zone="visibleZone?.isPlayerOwner(playerInfo)" :zone="visibleZone" />
    <ZoneNavigator :game="game" @select="onZoneSelect" />
    <PlayerHand :hand="playerHand"/>

  </div>
</template>


<style lang="scss" src="@assets/styles/page/game.scss"></style>