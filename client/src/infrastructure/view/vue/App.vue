<script lang="ts" setup>
import ErrorViewerComponent from './components/ErrorViewerComponent.vue';

</script>

<template>
  <main>
    <router-view />

    <ErrorViewerComponent />
  </main>
</template>

<style lang="scss" src="@assets/styles/main.scss"></style>