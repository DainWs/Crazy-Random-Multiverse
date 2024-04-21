<script setup>
import ZoneView from '@/infrastructure/view/vue/components/game/zone/ZoneView.vue';
import ZoneNavigator from '@/infrastructure/view/vue/components/game/zone/ZoneNavigator.vue';
import gameController from '@/infrastructure/view/vue/pages/game/GameController';
const game = gameController.getReactiveGame();
const playerInfo = gameController.getReactivePlayerInfo();
const previewedZone = gameController.getReactivePreviewedZone();
const onZoneSelect = gameController.onZoneSelect;
const onActionPerformed = gameController.onActionPerformed;
</script>

<template>
  <!--<div style="color: white; position: absolute; top: 0;">{{ game }}</div>-->
  <div class="game">
    <!-- TODO Agregar e implementar componente ErrorMessagesComponent -->
  
    <!-- TODO Agregar enemy zone preview -->
    <ZoneView :zone="previewedZone" @action="onActionPerformed" />
    <ZoneNavigator :game="game" @select="onZoneSelect" />
  </div>
</template>


<style lang="scss" src="@assets/styles/page/game.scss">
</style>