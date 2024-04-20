<script setup>
import AppLogo from '@/infrastructure/view/vue/shared/AppLogo.vue'
import homeController from '@/infrastructure/view/vue/home/HomeController';
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
          <h1>Crazy Random Multiverses - {{ value.title }}</h1>
        </div>
        <div class="menu">
          <div class="menu__item button button--hover button--left-to-right">
            <a @click="onCreatePartyClick">Crear partida</a>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <a @click="onJoinPartyClick">Unirse a partida</a>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <a @click="onSettingsClick">Ajustes</a>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <a @click="onCreditsClick">Creditos</a>
          </div>

          <div class="menu__item button button--hover button--left-to-right" v-if="isNotBrowserPlatform">
            <a @click="onExitClick">Salir</a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" src="@/infrastructure/view/assets/styles/page/home.scss" scoped>
</style>