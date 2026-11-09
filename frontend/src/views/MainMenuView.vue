<script setup lang="ts">
import { ref } from 'vue';
import partyController from '@/controllers/PartyController';
import SessionNotice from '@/views/SessionNotice.vue';
import SessionSystem from '@/core/SessionSystem';
import { getText } from '@/core/Texts';

const partyCode = ref('');
const errorKey = ref<string | undefined>();

const create = async () => {
    SessionSystem.dismissNotice();
    errorKey.value = await partyController.createParty();
};

const join = async () => {
    SessionSystem.dismissNotice();
    errorKey.value = await partyController.joinParty(partyCode.value);
};
</script>

<template>
    <main class="screen">
        <h1>{{ getText('ui.main_menu.title') }}</h1>
        <button type="button" @click="create">{{ getText('ui.main_menu.create_party') }}</button>
        <form @submit.prevent="join">
            <input v-model="partyCode" type="text" :placeholder="getText('ui.main_menu.party_code')" />
            <button type="submit" :disabled="partyCode.trim() === ''">{{ getText('ui.main_menu.join_party') }}</button>
        </form>
        <SessionNotice />
        <p v-if="errorKey" class="error" role="alert">{{ getText(errorKey) }}</p>
    </main>
</template>
