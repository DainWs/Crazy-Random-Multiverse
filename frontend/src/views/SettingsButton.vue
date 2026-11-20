<script setup lang="ts">
import SettingsSystem from '@/core/SettingsSystem';
import { getText } from '@/core/Texts';

const panelOpen = SettingsSystem.panelOpen;
</script>

<template>
    <button type="button" class="settings-button" :aria-expanded="panelOpen" @click="SettingsSystem.togglePanel()">
        {{ getText('ui.settings.open') }}
    </button>
</template>

<style scoped>
.settings-button {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 950;
    padding: 8px 16px;
    font-size: 24px;
}
</style>
