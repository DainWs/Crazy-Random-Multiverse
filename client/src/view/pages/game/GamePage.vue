<script lang="ts" setup>
import ZoneView from '@pages/game/zone/ZoneView.vue';
import ZoneNavigator from '@pages/game/zone/ZoneNavigator.vue';
import gameController from '@view/pages/game/GameController';
const game = gameController.getReactiveGame();
const playerInfo = gameController.getReactivePlayerInfo();
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
  </div>
</template>


<style lang="scss" src="@assets/styles/page/game.scss"></style>