<script setup>
import partyController from '@/controllers/partyController'
import { reactive, watch } from 'vue'

// TODO tal vez los controllers deberian devolver un proxy
const parties = partyController.getParties();
const joinParty = partyController.joinParty;
const refreshParties = partyController.refreshParties;

watch(parties, async (newParties, oldParties) => {
  console.log("change")
})
</script>

<template>
  <div class="party-list">
    <div class="party-list__container bg-dark text-light">
      <div class="party-list__header">
        <h1 class="title">Lista de fiestas</h1>
      </div>
      <ul class="party-list__content">
        <li v-for="party in parties">
          <span>{{ party.name }}</span>
          <div class="content-splitter"></div>
          <span class="members-count">Jugadores: {{ party.userCount }}/{{ party.maxUsers }}</span>
          <div class="button button--icon">
              <a @click="() => joinParty(party)" v-show="party.userCount < party.maxUsers">Entrar &#10095;</a>
          </div>
        </li>
      </ul>
      <div class="party-list__footer menu menu--horizontal">
        <div class="button button--hover button--left-to-right secondary">
          <RouterLink to="/">Salir</RouterLink>
        </div>
        <div class="button button--hover button--left-to-right">
          <a @click="refreshParties">Actualizar</a>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>