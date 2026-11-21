<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import SettingsSystem from '@/core/SettingsSystem';
import { createFocusTrapRef } from '@/views/FocusTrap';
import { getText } from '@/core/Texts';

const CLOSE_KEY = 'Escape';

const panelOpen = SettingsSystem.panelOpen;
const trapFocus = createFocusTrapRef();

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === CLOSE_KEY && panelOpen.value) {
        SettingsSystem.closePanel();
    }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
    <div v-if="panelOpen" class="settings-veil" @click.self="SettingsSystem.closePanel()">
        <section :ref="trapFocus" class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <h2 id="settings-title">{{ getText('ui.settings.title') }}</h2>
            <button type="button" @click="SettingsSystem.closePanel()">{{ getText('ui.settings.close') }}</button>
        </section>
    </div>
</template>

<style scoped>
.settings-veil {
    position: fixed;
    inset: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--veil-background);
    color: var(--text-color);
}

.settings-panel {
    min-width: 320px;
    margin: 0 16px;
    padding: 24px 32px;
    border: 2px solid var(--panel-border);
    border-radius: 8px;
    background: var(--panel-background);
    font-size: 24px;
    outline: none;
}

.settings-panel h2 {
    margin: 0 0 24px;
    font-size: 28px;
}
</style>
