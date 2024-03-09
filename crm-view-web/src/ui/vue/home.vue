<script setup>
import homeController from '@/controllers/homeController';
const createParty = homeController.createParty;
const refreshParties = homeController.refreshParties;

const plataform = env.plataform;
</script>

<template>
  <div class="home">
    <img alt="Monos con Minigun logo" class="logo" src="@/ui/assets/images/logo.png" />

    <nav class="home__content">
      <div> <!-- ¿este div por qué? -->
        <div class="home__title">
          <h1>Crazy Random Multiverses</h1>
        </div>
        <div class="menu">
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/party" @click="createParty">Create Party</RouterLink>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/party-list" @click="refreshParties">Join Party</RouterLink>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/settings">Settings</RouterLink>
          </div>
          <div class="menu__item button button--hover button--left-to-right">
            <RouterLink to="/credits">Credits</RouterLink>
          </div>

          <div class="menu__item button button--hover button--left-to-right" v-if="plataform !== 'browser'">
            <a>Exit</a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" src="@/ui/assets/styles/page/home.scss" scoped>
</style>