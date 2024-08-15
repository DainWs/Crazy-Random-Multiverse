<script lang="ts" setup>
import CardComponent from '@/infrastructure/view/vue/pages/game/card/CardComponent.vue';
import previewController from '@/infrastructure/view/vue/pages/preview/PreviewController';
import ZoneView from '@vue-pages/game/zone/ZoneView.vue';
const cards = previewController.generateCards(100);
const zone = previewController.generateZone();
const onBackClick = previewController.onBackClick;
</script>

<template>
  <div class="dws--content">
    <div class="dws--tile" style="height: auto;">
      <h1 class="dws--title">Preview</h1>
      <img src="@assets/images/close-large.svg" class="dws--close" @click="onBackClick" />
      <section>
        <ZoneView :zone="zone"></ZoneView>
      </section>
      <section class="dws__scrollable dws--cards-list">
        <CardComponent v-for="card in cards" :key="card.code.toString()" :card="card"></CardComponent>
      </section>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/preview.scss" scoped></style>
