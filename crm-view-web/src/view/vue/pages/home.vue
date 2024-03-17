<script setup>
import homeController from '@/controllers/homeController';
const createParty = homeController.createParty;

const isNotBrowserPlataform = CRM_PLATAFORM !== 'browser';
</script>

<template>
  <div class="home">
    <img alt="Monos con Minigun logo" class="logo" src="@/view/assets/images/logo.png" />

    <nav class="home__content">
      <div> <!-- ¿este div por qué? -->
        <div class="home__title">
          <h1>Crazy Random Multiverses</h1>
        </div>
        <div class="menu">
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/party" @click="createParty">Crear partida</RouterLink>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/party-list">Unirse a partida</RouterLink>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/settings">Ajustes</RouterLink>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/credits">Creditos</RouterLink>
          </div>

          <div class="menu__item button button--hover button--left-to-right" v-if="isNotBrowserPlataform">
            <a>Salir</a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" src="@/view/assets/styles/page/home.scss" scoped>
</style>