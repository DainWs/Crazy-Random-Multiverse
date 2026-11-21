<script setup lang="ts">
import type { BoardCamera } from '@/core/SettingsSystem';
import { onMounted, onUnmounted } from 'vue';
import SettingsSystem, { BOARD_CAMERAS } from '@/core/SettingsSystem';
import { createFocusTrapRef } from '@/views/FocusTrap';
import { getText } from '@/core/Texts';

const CLOSE_KEY = 'Escape';

const BOARD_CAMERA_TEXT_KEYS = new Map<BoardCamera, string>([
    ['TOP_DOWN', 'ui.settings.camera.top_down'],
    ['TILTED', 'ui.settings.camera.tilted']
]);

const panelOpen = SettingsSystem.panelOpen;
const boardCamera = SettingsSystem.boardCamera;
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
            <fieldset>
                <legend>{{ getText('ui.settings.camera') }}</legend>
                <label v-for="camera in BOARD_CAMERAS" :key="camera">
                    <input
                        type="radio"
                        name="board-camera"
                        :value="camera"
                        :checked="boardCamera === camera"
                        @change="SettingsSystem.setBoardCamera(camera)"
                    />
                    {{ getText(BOARD_CAMERA_TEXT_KEYS.get(camera)!) }}
                </label>
            </fieldset>
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
    margin: 0 0 16px;
    font-size: 28px;
}

.settings-panel fieldset {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0 0 24px;
    padding: 12px 16px;
    border: 1px solid var(--panel-border);
}

.settings-panel label {
    display: flex;
    align-items: center;
    gap: 12px;
}

.settings-panel input[type='radio'] {
    width: 24px;
    height: 24px;
}
</style>
