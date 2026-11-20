<script setup lang="ts">
import type { CardValue } from '@/core/SettingsSystem';
import { onMounted, onUnmounted } from 'vue';
import SettingsSystem, { CARD_VALUES } from '@/core/SettingsSystem';
import { createFocusTrapRef } from '@/views/FocusTrap';
import { getText } from '@/core/Texts';

const CLOSE_KEY = 'Escape';
const CARD_VALUE_TEXT_KEYS = new Map<CardValue, string>([
    ['DAMAGE', 'ui.card.damage'],
    ['ARMOR', 'ui.card.armor'],
    ['HEALTH', 'ui.card.health']
]);

const panelOpen = SettingsSystem.panelOpen;
const trapFocus = createFocusTrapRef();

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === CLOSE_KEY && panelOpen.value) {
        SettingsSystem.closePanel();
    }
};

const onToggle = (cardValue: CardValue, event: Event) => {
    SettingsSystem.setCardValue(cardValue, (event.target as HTMLInputElement).checked);
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
    <div v-if="panelOpen" class="settings-veil" @click.self="SettingsSystem.closePanel()">
        <section :ref="trapFocus" class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <h2 id="settings-title">{{ getText('ui.settings.title') }}</h2>
            <fieldset>
                <legend>{{ getText('ui.settings.card_values') }}</legend>
                <label v-for="cardValue in CARD_VALUES" :key="cardValue">
                    <input
                        type="checkbox"
                        :name="cardValue"
                        :checked="SettingsSystem.cardValuesOn.value.has(cardValue)"
                        @change="onToggle(cardValue, $event)"
                    />
                    {{ getText(CARD_VALUE_TEXT_KEYS.get(cardValue)!) }}
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

.settings-panel input[type='checkbox'] {
    width: 24px;
    height: 24px;
}
</style>
