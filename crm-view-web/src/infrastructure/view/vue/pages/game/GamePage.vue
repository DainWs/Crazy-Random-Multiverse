<script setup>
import ZonePreview from '@/infrastructure/view/vue/game/components/zone/ZonePreview.vue';
import ZoneNavigator from '@/infrastructure/view/vue/game/components/zone/ZoneNavigator.vue';
import gameController from '@/infrastructure/view/vue/game/GameController';
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
    <ZonePreview :zone="previewedZone" @action="onActionPerformed" />
    <ZoneNavigator :game="game" @select="onZoneSelect" />
  </div>
</template>


<style lang="scss" src="@/infrastructure/view/assets/styles/page/game.scss">
</style>