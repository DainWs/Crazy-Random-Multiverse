<script lang="ts" setup>
import AppLogo from '@components/shared/AppLogo.vue'
import AppButton from '@components/shared/AppButton.vue';
import usePartyStore from '@/stores/PartyStore';
import { navigator } from '@view/configuration/router';
import { IS_DEVELOPMENT } from '@/env'

// TODO define party create form
const partyStore = usePartyStore();

const onCreateVsAIClick = async () => {
  await partyStore.createOwnParty('PLAYER_VS_AI', 1);
  navigator.navigateTo('party');
};

const onCreatePartyClick = async () => {
  await partyStore.createOwnParty('CLASSIC', 4);
  navigator.navigateTo('party');
};

const onJoinPartyClick = navigator.navigateToFunc('party-list');
const onCreditsClick = navigator.navigateToFunc('credits');
const onPreviewClick = navigator.navigateToFunc('preview');
</script>

<template>
  <div class="home">
    <AppLogo />

    <nav class="home__content">
      <div> <!-- ¿este div por qué? -->
        <div class="home__title">
          <h1>Crazy Random Multiverses</h1>
        </div>
        <div class="menu">
          <AppButton tabindex="1" text="Jugar" class-name="menu__item" @click="onCreateVsAIClick" />
          <AppButton tabindex="2" text="Crear partida multijugador" class-name="menu__item" @click="onCreatePartyClick" />
          <AppButton tabindex="3" text="Unirse a partida" class-name="menu__item" @click="onJoinPartyClick" />
          <AppButton tabindex="4" text="Creditos" class-name="menu__item" @click="onCreditsClick" />
          <AppButton v-if="IS_DEVELOPMENT" tabindex="5" text="Preview" class-name="menu__item"
            @click="onPreviewClick" />
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/home.scss" scoped></style>