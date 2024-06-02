<script lang="ts" setup>
import AppLogo from '@vue-components/shared/AppLogo.vue'
import AppButton from '@vue-components/shared/AppButton.vue';
import homeController from '@/infrastructure/view/vue/pages/home/HomeController';
const isNotBrowserPlatform = homeController.isNotBrowserPlatform();
const onCreatePartyClick = homeController.onCreatePartyClick;
const onJoinPartyClick = homeController.onJoinPartyClick;
const onSettingsClick = homeController.onSettingsClick;
const onCreditsClick = homeController.onCreditsClick;
const onExitClick = homeController.onExitClick;
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
          <AppButton tabindex="1" text="Crear partida" class-name="menu__item" @click="onCreatePartyClick" />
          <AppButton tabindex="2" text="Unirse a partida" class-name="menu__item" @click="onJoinPartyClick" />
          <AppButton tabindex="3" text="Ajustes" class-name="menu__item" @click="onSettingsClick" />
          <AppButton tabindex="4" text="Creditos" class-name="menu__item" @click="onCreditsClick" />
          <AppButton v-if="isNotBrowserPlatform" tabindex="5" text="Salir" class-name="menu__item"
            @click="onExitClick" />
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" src="@assets/styles/page/home.scss" scoped></style>