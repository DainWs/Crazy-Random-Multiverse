<script setup lang="ts">
import SessionSystem from '@/core/SessionSystem';
import { getText } from '@/core/Texts';

const notice = SessionSystem.notice;
</script>

<template>
    <p v-if="notice" class="notice" role="alert">
        <span>{{ getText(notice.key) }}</span>
        <button type="button" @click="SessionSystem.dismissNotice()">{{ getText('ui.notice.dismiss') }}</button>
    </p>
</template>

<style scoped>
.notice {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 520px;
    margin: 0;
    padding: 12px 16px;
    border: 2px solid var(--panel-border);
    border-radius: 8px;
    background: var(--panel-background);
    color: var(--text-color);
    font-size: 18px;
}

.notice button {
    flex-shrink: 0;
    padding: 6px 12px;
    border: 0;
    border-radius: 4px;
    background: var(--button-background);
    color: var(--text-color);
    font-size: 16px;
    cursor: pointer;
}

.notice button:hover {
    background: var(--button-hover-background);
}
</style>
