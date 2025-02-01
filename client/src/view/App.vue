<script lang="ts" setup>
import ErrorViewerComponent from '@view/components/ErrorViewerComponent.vue';
import { useWebsocket } from '@/services/useWebsocket';
useWebsocket();
</script>

<template>
  <main class="dws--green">
    <router-view />

    <ErrorViewerComponent />
  </main>
</template>

<style lang="scss" src="@assets/styles/main.scss"></style>