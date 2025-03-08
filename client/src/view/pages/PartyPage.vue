<script lang="ts" setup>
import usePartyStore from '@/stores/PartyStore';
import useSessionStore from '@/stores/SessionStore';
import { navigator } from '@view/configuration/router';
import AppButton from '@components/shared/AppButton.vue';

const sessionStore = useSessionStore();
const partyStore = usePartyStore();

const currentUser = sessionStore.currentUser;
const currentParty = partyStore.currentParty;
const isAdmin = currentParty?.isUserAdmin(currentUser.username);

const onStartClick = partyStore.startPartyGame;
const onLeaveClick = async () => {
  await partyStore.leaveFromParty();
  navigator.navigateTo('home');
};
</script>

<template>
  <div class="party">
    <div class="party__container bg-dark text-light">
      <div class="party__header">
        <h1 class="title">Wait room</h1>
        <span class="party-name">({{ currentParty?.name }})</span>
        <div class="content-splitter"></div>
        <div class="members-count">
          <span>Players:</span>
          <span>{{ currentParty?.getUserCapacity() }}</span>
        </div>
      </div>
      <ul class="party__content">
        <li v-for="username in currentParty?.users" :key="`list-item__${username}`">
          {{ username }}
          <span v-show="currentUser.username == username" class="tag">You</span>
          <span v-for="tag in currentParty?.getUserTags(username)" class="tag">{{ tag }}</span>
        </li>
      </ul>
      <div class="party__footer menu menu--horizontal">
        <AppButton text="Leave" kind="secondary" @click="onLeaveClick" />
        <AppButton v-show="isAdmin" text="Start" @click="onStartClick" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/party.scss" scoped></style>