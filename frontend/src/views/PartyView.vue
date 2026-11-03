<script setup lang="ts">
import { computed, ref } from 'vue';
import partyController from '@/controllers/PartyController';
import SessionSystem from '@/core/SessionSystem';
import StoreSystem from '@/core/StoreSystem';
import { getText } from '@/core/Texts';

const party = SessionSystem.party;
const user = StoreSystem.getUser();
const errorKey = ref<string | undefined>();
const isCodeCopied = ref(false);

const canStart = computed(() => !!party.value && partyController.canStartGame(party.value, user));
const isOwner = (code: string) => party.value?.owner?.code === code;

const copyCode = async () => {
    if (!party.value) return;
    await navigator.clipboard.writeText(party.value.code);
    isCodeCopied.value = true;
};

const leave = async () => {
    if (party.value) errorKey.value = await partyController.leaveParty(party.value);
};

const start = async () => {
    if (party.value) errorKey.value = await partyController.startGame(party.value);
};
</script>

<template>
    <main v-if="party" class="screen">
        <h1>{{ party.name }}</h1>
        <p>{{ party.userCount }}/{{ party.maxUsers }}</p>
        <section>
            <h2>{{ getText('ui.party.members') }}</h2>
            <ul>
                <li v-for="member in party.users" :key="member.code">
                    {{ member.name }}
                    <strong v-if="isOwner(member.code)">({{ getText('ui.party.owner') }})</strong>
                </li>
            </ul>
        </section>
        <p>
            {{ getText('ui.party.code') }}: <code>{{ party.code }}</code>
            <button type="button" @click="copyCode">{{ getText(isCodeCopied ? 'ui.party.code_copied' : 'ui.party.copy_code') }}</button>
        </p>
        <button type="button" @click="leave">{{ getText('ui.party.leave') }}</button>
        <button v-if="partyController.isOwner(party, user)" type="button" :disabled="!canStart" @click="start">
            {{ getText('ui.party.start') }}
        </button>
        <p v-if="errorKey" class="error" role="alert">{{ getText(errorKey) }}</p>
    </main>
</template>
