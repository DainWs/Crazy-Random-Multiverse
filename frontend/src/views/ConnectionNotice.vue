<script setup lang="ts">
import SessionSystem from '@/core/SessionSystem';
import { getText } from '@/core/Texts';

const noticeKey = SessionSystem.connectionNoticeKey;
</script>

<template>
    <div v-if="noticeKey" class="connection-notice" role="alert">
        <p class="connection-notice__panel">{{ getText(noticeKey) }}</p>
    </div>
</template>

<style scoped>
.connection-notice {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--veil-background);
    color: var(--text-color);
}

.connection-notice__panel {
    max-width: 520px;
    margin: 0 16px;
    padding: 24px 32px;
    border: 2px solid var(--panel-border);
    border-radius: 8px;
    background: var(--panel-background);
    font-size: 24px;
    text-align: center;
}
</style>
