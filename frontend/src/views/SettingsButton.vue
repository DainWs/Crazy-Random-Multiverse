<script setup lang="ts">
import SettingsSystem from '@/core/SettingsSystem';
import { getText } from '@/core/Texts';

const GEAR_PATH =
    'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22' +
    'l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57' +
    '-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03' +
    ' 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24' +
    ' 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01' +
    '-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z';

const panelOpen = SettingsSystem.panelOpen;
</script>

<template>
    <button
        type="button"
        class="settings-button"
        :aria-label="getText('ui.settings.open')"
        :aria-expanded="panelOpen"
        @click="SettingsSystem.togglePanel()"
    >
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path :d="GEAR_PATH" />
        </svg>
    </button>
</template>

<style scoped>
.settings-button {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 950;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 6px;
    border: 2px solid var(--panel-border);
    border-radius: 8px;
    background: var(--button-background);
    color: var(--text-color);
    cursor: pointer;
}

.settings-button:hover,
.settings-button[aria-expanded='true'] {
    background: var(--button-hover-background);
}

.settings-button svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
}
</style>
