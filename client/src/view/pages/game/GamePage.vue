<script lang="ts" setup>
import PlayerHand from '@pages/game/hand/PlayerHand.vue';
import ZoneView from '@pages/game/zone/ZoneView.vue';
import ZoneNavigator from '@pages/game/zone/ZoneNavigator.vue';
import useGameController from '@pages/game/useGameController';

const gameController = useGameController();

const game = gameController.getReactiveGame();
const playerInfo = gameController.getReactivePlayerInfo();
const playerHand = gameController.getReactivePlayerHand();
const visibleZone = gameController.getReactiveVisibleZone();
const onZoneSelect = gameController.onZoneSelect;
const onActionPerformed = gameController.onActionPerformed;
</script>

<template>
  <!--<div style="color: white; position: absolute; top: 0;">{{ game }}</div>-->
  <div class="game">
    <!-- TODO Agregar e implementar componente ErrorMessagesComponent -->

    <!-- TODO Agregar enemy zone preview -->
    <ZoneView v-if="visibleZone" :zone="visibleZone" />
    <ZoneNavigator :game="game" @select="onZoneSelect" />
    <PlayerHand :hand="playerHand"/>
  </div>
</template>


<style lang="scss" src="@assets/styles/page/game.scss"></style>