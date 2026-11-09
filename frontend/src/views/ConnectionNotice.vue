<script setup lang="ts">
import SessionSystem from '@/core/SessionSystem';
import { getText } from '@/core/Texts';

const noticeKey = SessionSystem.connectionNoticeKey;
</script>

<template>
    <div v-if="noticeKey" class="connection-notice" role="alert">
        <p>{{ getText(noticeKey) }}</p>
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
    background: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    font-size: 24px;
}
</style>
