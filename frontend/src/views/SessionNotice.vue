<script setup lang="ts">
import SessionSystem from '@/core/SessionSystem';
import { getText } from '@/core/Texts';

const notice = SessionSystem.notice;
</script>

<template>
    <p v-if="notice" class="notice" role="alert">
        {{ getText(notice.key) }}
        <button type="button" @click="SessionSystem.dismissNotice()">{{ getText('ui.notice.dismiss') }}</button>
    </p>
</template>
