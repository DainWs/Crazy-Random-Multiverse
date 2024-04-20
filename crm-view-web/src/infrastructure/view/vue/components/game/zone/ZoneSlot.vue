<script setup>
import CardComponent from '@/infrastructure/view/vue/components/card/CardComponent.vue';

/**
 * @typedef {object} Props
 * @property {import('@/domain/card').Card} card
 * @property {import('@/domain/position').Position} slot
 */

/** @type {Props} */
const props = defineProps({ slot: { require: true }, card: { require: true } });
defineEmits(['grab', 'dragover', 'drop']);
</script>

<template>
    <div class="zone-slot" 
        @dragstart="$emit('grab', { slot, card, originalEvent: $event })" 
        @dragover="$emit('dragover', { slot, card, originalEvent: $event })"
        @drop="$emit('drop', { slot, card, originalEvent: $event })"
    >
        <CardComponent :card="card" v-if="card" />
    </div>
</template>

<style lang="scss"></style>
