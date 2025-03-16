<script lang="ts" setup>
import { ref, watch } from 'vue';
import Zone from '@/domain/models/Zone';
import Hand from '@/domain/models/Hand';
import Card from '@/domain/models/Card';
import cardFactory from '@/domain/CardFactory';

import ZoneView from '@pages/game/zone/ZoneView.vue';
import PlayerHand from '@pages/game/hand/PlayerHand.vue';
import CardComponent from '@pages/game/card/CardComponent.vue';
import useSessionStore from '@/stores/SessionStore';
import { navigator } from '@view/configuration/router';

const sessionStore = useSessionStore();
const cardsToGenerate = 10;

const cards: Card[] = [];
const hand = ref(new Hand(sessionStore.currentUser.toPlayer()));

for (let i = 0; i < cardsToGenerate; i++) {
  const card = cardFactory.createCard();
  cards.push(card);
  setTimeout(() => hand.value.addCard(card), 3000 * i);
}

const zone = ref(new Zone(sessionStore.currentUser.toPlayer()));
zone.value.health = 75;
zone.value.maxHealth = 100;
zone.value.combatants = [];
zone.value.combatants[0] = new Array(3);
zone.value.combatants[1] = new Array(3);
zone.value.combatants[1][1] = cardFactory.createCard();

watch(zone, (zone, oldZone) => {
  console.log(zone)
  console.log(oldZone)
});

setTimeout(() => {
  zone.value.health = 10;
  console.log("aaaaaaaaaaaaaaaa")

}, 1000)
const onBackClick = navigator.navigateToFunc('home');
</script>

<template>
  <div class="dws--content">
    <div class="dws--tile" style="height: auto;">
      <h1 class="dws--title">Preview</h1>
      <img src="@assets/images/close-large.svg" class="dws--close" @click="onBackClick" />
      <div class="horizontal--50-50">
        <section>
          <ZoneView :zone="zone"></ZoneView>
        </section>
        <section>
          <PlayerHand :hand="hand"></PlayerHand>
        </section>

        <section class="dws__scrollable dws--cards-list">
          <CardComponent v-for="card in cards" :key="card.code.toString()" :card="card"></CardComponent>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/preview.scss" scoped></style>
<style lang="scss" scoped>
.horizontal--50-50 {
  display: flex;
  flex-direction: row;

  padding-bottom: 50px;

  &>section {
    height: calc(80vh - 50px);
  }
}
</style>
