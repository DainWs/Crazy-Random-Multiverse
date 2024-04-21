<script setup>
import { onMounted } from 'vue';
import AppButton from '@/infrastructure/view/vue/components/shared/AppButton.vue';
import partyController from '@/infrastructure/view/vue/pages/party/PartyController';
onMounted(partyController.onLoad);
const userInfo = partyController.getUserInfo();
const partyInfo = partyController.getReactivePartyInfo();
const onStartClick = partyController.onStartClick;
const onLeaveClick = partyController.onLeaveClick;
</script>

<template>
  <div class="party">
    <div class="party__container bg-dark text-light">
      <div class="party__header">
        <h1 class="title">Sala de espera</h1>
        <span class="party-name">({{ partyInfo.name }})</span>
        <div class="content-splitter"></div>
        <div class="members-count">
          <span>Jugadores:</span>
          <span>{{ partyInfo.userCount }}/{{ partyInfo.maxUsers }}</span>
        </div>
      </div>
      <ul class="party__content">
        <li v-for="user in partyInfo.users">
          {{ user }}
          <span class="tag" v-show="userInfo.username === user">Tú</span>
          <span class="tag" v-show="user === partyInfo.owner">Admin</span>
        </li>
      </ul>
      <div class="party__footer menu menu--horizontal">
        <AppButton text="Salir" kind="secondary" @click="onLeaveClick" />
        <AppButton text="Empezar" @click="onStartClick" v-show="userInfo.username === partyInfo.owner"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/party.scss" scoped>
</style>