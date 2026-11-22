<script setup lang="ts">
import SettingsSystem from '@/core/SettingsSystem';
import { getText } from '@/core/Texts';

const helpOpen = SettingsSystem.helpOpen;
</script>

<template>
    <button
        type="button"
        class="help-button"
        :aria-label="getText('ui.help.open')"
        :aria-expanded="helpOpen"
        @click="SettingsSystem.toggleHelp()"
    >
        <span aria-hidden="true">?</span>
    </button>
</template>

<style scoped>
.help-button {
    position: fixed;
    top: 16px;
    right: 76px;
    z-index: 950;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 2px solid var(--panel-border);
    border-radius: 8px;
    background: var(--button-background);
    color: var(--text-color);
    font-family: var(--ui-font);
    font-size: 32px;
    font-weight: bold;
    line-height: 1;
    cursor: pointer;
}

.help-button:hover,
.help-button[aria-expanded='true'] {
    background: var(--button-hover-background);
}
</style>
