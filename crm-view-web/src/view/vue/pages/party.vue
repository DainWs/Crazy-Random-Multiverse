<script setup>
import { onMounted } from 'vue';
import partyController from '@/view/vue/controllers/partyController';
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
        <div class="button button--hover button--left-to-right secondary">
          <a @click="onLeaveClick">Salir</a>
        </div>

        <div class="button button--hover button--left-to-right" v-show="userInfo.username === partyInfo.owner">
          <a @click="onStartClick">Empezar</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@/view/assets/styles/page/party.scss" scoped>
</style>