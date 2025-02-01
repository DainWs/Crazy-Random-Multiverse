<script lang="ts" setup>
import AppButton from '@components/shared/AppButton.vue';
import usePartyController from '@pages/party/usePartyController';

const partyController = usePartyController();
const partyStoreProxy = partyController.getReactivePartyInfo();
const onStartClick = partyController.onStartClick;
const onLeaveClick = partyController.onLeaveClick;
</script>

<template>
  <div class="party">
    <div class="party__container bg-dark text-light">
      <div class="party__header">
        <h1 class="title">Sala de espera</h1>
        <span class="party-name">({{ partyStoreProxy.currentParty?.name }})</span>
        <div class="content-splitter"></div>
        <div class="members-count">
          <span>Jugadores:</span>
          <span>{{ partyStoreProxy.currentParty?.getUserCapacity() }}</span>
        </div>
      </div>
      <ul class="party__content">
        <li v-for="username in partyStoreProxy.currentParty?.users" :key="`list-item__${username}`">
          {{ username }}
          <span v-show="partyController.shouldShowYouTagFor(username)" class="tag">Tú</span>
          <span v-show="partyController.shouldShowAdminTagFor(username)" class="tag">Admin</span>
        </li>
      </ul>
      <div class="party__footer menu menu--horizontal">
        <AppButton text="Salir" kind="secondary" @click="onLeaveClick" />
        <AppButton v-show="partyController.shouldShowStartButton()" text="Empezar" @click="onStartClick" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/party.scss" scoped></style>