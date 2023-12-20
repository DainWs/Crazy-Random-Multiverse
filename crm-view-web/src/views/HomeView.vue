<script setup>
import Destinations from '@/services/stomp/StompDestinations';
import StompService from '@/services/stomp/StompService';
import { useRouter } from 'vue-router';

const plataform = env.plataform;
const router = useRouter()

function createParty() {
  StompService.send(Destinations.PARTY_CREATE)
  router.push("/party")
}

function joinParty() {
  StompService.sendSync(Destinations.PARTY_LIST)
  router.push("/party-list")
}
</script>

<template>
  <div class="w-100 h-100 position-relative">
    <img alt="Monos con Minigun logo" class="logo rounded-circle position-absolute bottom-0 end-0 mb-4 me-4"
      src="@/assets/images/logo.png" />

    <nav class="d-flex justify-content-center align-items-center">
      <div class="d-inline-flex flex-column">
        <div class="main-title">
          <h1>Crazy Random Multiverses</h1>
        </div>
        <div class="d-inline-flex justify-content-between flex-column link-menu">
          <div class="link-menu--item">
            <a class="text-decoration-none link-hover from-left" @click="createParty">Create Party</a>
          </div>
          <div class="link-menu--item">
            <a class="text-decoration-none link-hover from-left" @click="joinParty">Join Party</a>
          </div>
          <div class="link-menu--item">
            <RouterLink to="/settings" class="text-decoration-none link-hover from-left">Settings</RouterLink>
          </div>
          <div class="link-menu--item">
            <RouterLink to="/credits" class="text-decoration-none link-hover from-left">Credits</RouterLink>
          </div>

          <div class="link-menu--item"  v-if="plataform !== 'browser'">
            <a class="text-decoration-none link-hover from-left">Exit</a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss">
@keyframes logoAnimation {
  0% {
    box-shadow: 0 0 0 3px #c2c2c2;
  }

  50% {
    box-shadow: 0 0 0 6px #969696;
  }

  100% {
    box-shadow: 0 0 0 3px #c2c2c2;
  }
}

.logo {
  width: 10%;
  height: 10%;
  max-width: 80px;
  max-height: 80px;

  animation-name: logoAnimation;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

.main-title {
  margin-bottom: 3rem;
  padding: 1rem;
  background-color: white;
  position: relative;

  h1 {
    cursor: default;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    user-select: none;
    margin: 0 !important;
    text-align: center;
    white-space: nowrap;

    &:before,
    &:after {
      background-color: #c50000;
      content: '';
      display: block;
      height: 0.25rem;
      width: 55%;
    }

    &:before {
      margin-right: auto;
      margin-bottom: 1rem;
    }

    &:after {
      margin-left: auto;
      margin-top: 1rem;
    }
  }
}

nav {
  width: 100%;
  height: 100%;
}

.link-menu {
  a { color: rgb(167, 90, 27); }

  &--item {
    z-index: 1;
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 196, 0);
    margin-bottom: 3%;

    &.secondary {
      border-width: .2rem;
      border-style: solid;
      border-color: rgb(255, 196, 0);

      background-color: rgb(0, 0, 0, 0);
    }

    > a { height: 100%; }
  }

  &--horizontal &--item {
    margin: 0;
  }
}

.link-hover {
  position: relative;
  padding: 2vh 3vh;
  font-size: 1.4rem;
  color: rgb(255, 196, 0);
  letter-spacing: 1.1rem;
  text-transform: uppercase;
  transition: all 400ms cubic-bezier(0.77, 0, 0.175, 1);
  cursor: pointer;
  user-select: none;

  &:before, &:after {
    content: '';
    position: absolute;
    transition: inherit;
    z-index: -1;
  }

  &:hover {
    color: rgb(255, 196, 0);
    transition-delay: 0s;

    &:before {
      transition-delay: 0s;
    }

    &:after {
      background: rgb(167, 90, 27);
      transition-delay: 0s;
    }
  }
}

/* From Left */
.from-left {
  &:before,
  &:after {
    top: 0;
    width: 0;
    height: 100%;
  }

  &:before {
    right: 0;
    border: 1px solid rgb(167, 90, 27);
    border-left: 0;
    border-right: 0;
  }

  &:after {
    left: 0;
  }

  &:hover:before,
  &:hover:after {
    width: 100%;
  }
}
</style>