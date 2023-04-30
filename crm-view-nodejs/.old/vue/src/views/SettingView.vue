<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { settingsController } from '../services/settings/SettingsController';

settingsController.getGeneralConfiguration();
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
